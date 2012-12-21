from django.shortcuts import render_to_response
from endless_pagination.decorators import page_template
from django.template import RequestContext
from django.http import HttpResponse
from django.utils import simplejson
from django.core.urlresolvers import reverse

from django.db import connection, transaction
from django.db.models import Count
from models import *
import collections
import solr
from egrin2_django.settings import TABLE_PREFIX, STATIC_URL

# data tables related helpers
class DataTablesParam:
    """convenience class for handling DataTables integration"""
    def __init__(self, sEcho, display_start, display_length, sort_field, sort_dir):
        self.sEcho = sEcho
        self.display_start = display_start
        self.display_length = display_length
        self.display_end = display_start + display_length
        self.sort_field = sort_field
        self.sort_dir = sort_dir
        self.sort_field2 = sort_field if sort_dir == 'asc' else '-' + sort_field

    def batch(self, query):
        """retrieves a batched query from the given Django query set"""
        return query if self.display_length == -1 else query[self.display_start:self.display_end]

    def ordered_batch(self, query):
        """retrieves a batched query from the given Django query set which
        is ordered by the sort field"""
        return self.batch(query.order_by(self.sort_field2))


def get_sort_field2(request, fields, default_field):
    sort_field = default_field
    sort_dir = "asc"
    if "iSortCol_0" in request.GET:
        sort_field = fields[int(request.GET['iSortCol_0'])]
        
    if "sSortDir_0" in request.GET:
        sort_dir = request.GET['sSortDir_0']
    return sort_field, sort_dir

def get_sort_field(request, fields, default_field):
    sort_field, sort_dir = get_sort_field2(request, fields, default_field)
    return sort_field if sort_dir == 'asc' else '-' + sort_field

def get_dtparams(request, fields, default_sort_field):
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field, sort_dir = get_sort_field2(request, fields, default_sort_field)

    return DataTablesParam(sEcho, display_start, display_length,
                           sort_field, sort_dir)


def index(request):
    species = Species.objects.count()
    networks = Network.objects.count()
    corems = Corem.objects.count()
    genes = Gene.objects.count()
    conditions = Condition.objects.count()
    gres = Gre.objects.count()-2 # exclude eco_0 and hal_0, should to this more robust in future
    biclusters = Bicluster.objects.count()
    tfs = len(list(set([o.tf for o in greTF.objects.all()])))
    return render_to_response('index.html', locals())

def about(request):
    return render_to_response('about.html', locals())

def browse(request):
    species = Species.objects.count()
    networks = Network.objects.count()
    corems = Corem.objects.count()
    genes = Gene.objects.count()
    conditions = Condition.objects.count()
    gres = Gre.objects.count()
    biclusters = Bicluster.objects.count()
    tfs = len(list(set([o.tf for o in greTF.objects.all()])))
    return render_to_response('browse.html', locals())

def condition_detail_link(species, cond_id, label):
    return '<a href="%s">%s</a>' % (reverse('condition_detail',
                                            args=[species, cond_id]), label)

def gre_detail_link(species, gre_id, label):
    return '<a href="%s">%s</a>' % (reverse('gre_detail',
                                            args=[species, gre_id]), label)

def species_detail_link(species, label):
    return '<a href="%s">%s</a>' % (reverse('species', args=[species]), label)

def ncbi_accession_link(accession):
    return '<a href="http://www.ncbi.nlm.nih.gov/protein/%s">%s</a>' % (accession, accession)

def ncbi_chromosome_link(chromosome):
    return '<a href="http://www.ncbi.nlm.nih.gov/nuccore/%s">%s</a>' % (chromosome, chromosome)

def amigo_link(go_id):
    return '<a href="http://amigo.geneontology.org/cgi-bin/amigo/term_details?term=%s">%s</a>' % (go_id,go_id)

def conditions_json(request, species):
    # TODO: note that we still need to figure out how to sort on a multi-valued
    # many-to-many aggregate (count(genes), count(gres))
    fields = ['cond_id', 'cond_name', 'corem_count']
    dtparams = get_dtparams(request, fields, fields[0])
    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    network = Network.objects.filter(species__ncbi_taxonomy_id=species)
    num_total = Condition.objects.filter(network__in=network).count()
    query = Condition.objects.filter(network__in=network).annotate(
        corem_count=Count('corems'))

    batch = dtparams.ordered_batch(query)

    conds = [[condition_detail_link(species, c.cond_id, c.cond_id),
              c.cond_name,
              c.corem_count,
              c.gene_set.count(), c.gre_set.count()]
             for c in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': conds
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

def conditions_json_generic(query, dtparams):
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    conds = [[condition_detail_link(species, item.cond.cond_id, item.cond.cond_id),
              item.cond.cond_name,
              item.p_val] for item in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': conds
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


def corem_conditions_json(request, species, corem):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = CoremConditionMembership.objects.filter(corem=corem)
    return conditions_json_generic(query, dtparams)


def gene_conditions_json(request, species, gene):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GeneConditionMembership.objects.filter(gene__sys_name=gene)
    return conditions_json_generic(query, dtparams)

def gre_conditions_json(request, species, gre):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreConditionMembership.objects.filter(gre__gre_id=gre)
    return conditions_json_generic(query, dtparams)

def conditions(request, species=None):
    # Return info about conditions
    class SpeciesConditionInfo:
        def __init__(self,species):
            species_obj = Species.objects.get(ncbi_taxonomy_id=species)
            self.species_name = species_obj.name
            self.ncbi_taxonomy_id = species_obj.ncbi_taxonomy_id

    if species:
        out = [SpeciesConditionInfo(species)]
    else:
        species_ids = [s.ncbi_taxonomy_id for s in Species.objects.all()]
        out = [SpeciesConditionInfo(species_id) for species_id in species_ids]
    return render_to_response('conditions.html', locals())

def condition_detail(request, species=None, condition=None):
    s = Species.objects.get(ncbi_taxonomy_id=species)
    condition = Condition.objects.get(cond_id = condition,network__species=s)
    genes = Gene.objects.filter(conditions=condition)
    return render_to_response('condition_detail.html', locals())

def contact(request):
    return render_to_response('contact.html', locals())

def corem_detail_link(species, corem_id, label):
    return '<a href="%s">%s</a>' % (reverse('corem_detail',
                                            args=[species, corem_id]), label)

def corems_json(request, species):
    # note how we use the coalesce() function to generate 0
    # for NULL values from the outer join to GREs
    query = """select q1.corem_id, corem_name, num_genes, num_conditions, coalesce(num_gres, 0) as num_gres2
from (select c.id as corem_id, c.network_id, c.corem_id as corem_name,
count(cg.gene_id) as num_genes
from %scorem c left outer join %scorem_genes cg
on c.id = cg.corem_id group by c.id) as q1 left outer join
(select ccm.corem_id, count(ccm.cond_id) as num_conditions
from %scoremconditionmembership ccm group by ccm.corem_id) as q2
on q1.corem_id = q2.corem_id left outer join
(select gcm.corem_id, count(gcm.gre_id) as num_gres
from %sgrecoremmembership gcm group by gcm.corem_id) as q3
on q1.corem_id = q3.corem_id""" % (TABLE_PREFIX, TABLE_PREFIX, TABLE_PREFIX, TABLE_PREFIX)

    fields = ['corem_name', 'num_genes', 'num_conditions', 'num_gres2']
    dtparams = get_dtparams(request, fields, fields[0])

    networks = Network.objects.filter(species__ncbi_taxonomy_id=species)
    num_total = Corem.objects.filter(network__in=networks).count()
    network_ids = [str(network.id) for network in networks]

    query += " where network_id in (%s)" % (",".join(network_ids))
    query += (" order by %s %s" % (dtparams.sort_field, dtparams.sort_dir))
    if dtparams.display_length > 0:
        query += (" limit %d offset %d" % (dtparams.display_length, dtparams.display_start))

    cursor = connection.cursor()
    cursor.execute(query)
    corems = [[corem_detail_link(species, row[1], row[1]),
               row[2], row[3], row[4]] for row in cursor.fetchall()]

    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': corems
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


def corems_json_generic(query, dtparams):
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    corems = [[corem_detail_link(species, item.corem.corem_id, item.corem.corem_id),
               item.p_val] for item in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': corems
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

    
def condition_corems_json(request, species, condition):
    fields = ['corem__corem_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = CoremConditionMembership.objects.filter(cond__cond_id=condition)
    return corems_json_generic(query, dtparams)

def gre_corems_json(request, species, gre):
    fields = ['corem__corem_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreCoremMembership.objects.filter(gre__gre_id=gre)
    return corems_json_generic(query, dtparams)

def corems(request, species=None):
    # Return info about corems            
    class SpeciesCoremInfo:
        def __init__(self,species):
            species_obj = Species.objects.get(ncbi_taxonomy_id=species)
            self.species_name = species_obj.name
            self.ncbi_taxonomy_id = species_obj.ncbi_taxonomy_id

    if species:
        out = []
        out.append(SpeciesCoremInfo(species))
    else:
        species = [i.ncbi_taxonomy_id for i in Species.objects.all()]
        out = []
        for i in species:
            out.append(SpeciesCoremInfo(i))
    return render_to_response('corems.html', locals())

def corem_detail(request, species=None, corem=None):
    s = Species.objects.get(ncbi_taxonomy_id=species)
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)    
    return render_to_response('corem_detail.html', locals())

def corem_go_json(request, species=None, corem=None):
    """corem-specific go list"""
    fields = ['go__go_id', 'go__term', 'go__ontology', 'genes_annotated', 'p_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    corem = Corem.objects.get(corem_id=corem, network__species__ncbi_taxonomy_id=species)
    go_query = CoremGOMembership.objects.filter(corem=corem)
    go_query = go_query.order_by(sort_field)
    num_total = go_query.count()

    go_batch = go_query if display_length == -1 else go_query[display_start:display_end]
    
    gos = [[amigo_link(g.go.go_id),g.go.term,g.go.ontology,g.genes_annotated,g.p_val]
           for g in go_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': gos
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

def downloads(request):
    s = Species.objects.all()
    return render_to_response('downloads.html', locals())

def gene_detail_link(species, sys_name, label):
    return '<a href="%s">%s</a>' % (reverse('gene_detail',
                                            args=[species, sys_name]), label)
def genes_json(request, species):
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome']

    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    query = Gene.objects.filter(species__ncbi_taxonomy_id=species).order_by(sort_field)
    num_total = query.count()
    genes_batch = query if display_length == -1 else query[display_start:display_end]

    genes = [[gene_detail_link(species, g.sys_name, g.sys_name),
              g.name,
              ncbi_accession_link(g.accession),
              g.description, g.start, g.stop,
              g.strand,
              ncbi_chromosome_link(g.chromosome.refseq)] for g in genes_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': genes
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

def corem_genes_json(request, species=None, corem=None):
    """corem-specific gene list"""
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome__refseq']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    corem = Corem.objects.get(corem_id=corem, network__species__ncbi_taxonomy_id=species)
    s = Species.objects.get(ncbi_taxonomy_id=species)
    query = Gene.objects.filter(corem=corem, species=s).order_by(sort_field)
    num_total = query.count()
    genes_batch = query if display_length == -1 else query[display_start:display_end]    
    genes = [[gene_detail_link(species, g.sys_name, g.sys_name),
              g.name,
              ncbi_accession_link(g.accession),
              g.description, g.start, g.stop,
              g.strand,
              ncbi_chromosome_link(g.chromosome.refseq)] for g in genes_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': genes
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

def genes(request, species=None):
    # Return info about the genes
    class GeneInfo:
        def __init__(self,species):
            species_obj = Species.objects.get(ncbi_taxonomy_id=species)
            self.species_name = species_obj.name
            self.ncbi_taxonomy_id = species_obj.ncbi_taxonomy_id

    if species:
        out = [GeneInfo(species)]
    else:
        species_ids = [s.ncbi_taxonomy_id for s in Species.objects.all()]
        out = [GeneInfo(species_id) for species_id in species_ids]
    return render_to_response('genes.html', locals())

def gene_detail(request, species=None, gene=None):
    g = Gene.objects.get(sys_name=gene)
    s = Species.objects.get(ncbi_taxonomy_id=species)
    corems = Corem.objects.filter(genes__sys_name=gene)
    return render_to_response('gene_detail.html', locals())

def networks(request, species=None):
    # Return info about the network
    if species:
        species_objs = [Species.objects.get(ncbi_taxonomy_id=species)]
    else:
        species_objs = Species.objects.all()
        
    out = {}
    for s in species_objs:
        n = Network.objects.get(species__name=s.name)
        g = Gene.objects.filter(species__name=s.name).count()
        cond = Condition.objects.filter(network__name=n.name).count()
        corems = Corem.objects.filter(network__name=n.name).count()
        gres = Gre.objects.filter(network__name=n.name).count()-1 # exclude eco_0 and hal_0, should to this more robust in future
        out[s.short_name] = {"species":s,"network":n,"genes":g,
                             "conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('networks.html', locals())

def regulators(request,species=None):
    # get info about all regulators
    class regulators:
        def __init__(self,species,tf):
            self.CUTOFF = 0
            self.s = Species.objects.get(ncbi_taxonomy_id=species)
            self.tf = tf
            self.gres = list(set([o.gre_id for o in greTF.objects.filter(tf=tf,score__gte=self.CUTOFF)]))
            self.corems = list(set(Corem.objects.filter(gres__in=self.gres)))
            self.genes = list(set(Gene.objects.filter(gre__in=self.gres)))
            self.conds = list(set(Condition.objects.filter(gre__in=self.gres)))
    tfs = list(set([o.tf for o in greTF.objects.all()]))
    s = Species.objects.get(ncbi_taxonomy_id=species)
    out = [regulators(species, tf) for tf in tfs]
    return render_to_response('regulators.html', locals())

def regulator_detail(request,species=None,regulator=None):
    # get info about specific regulators
    class greObject:
        def __init__(self,species,tf,gre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.gre_id = gre.gre_id
            self.pssm = gre.pssm.matrix()
            self.score = greTF.objects.get(tf=tf,gre_id=gre).score

    CUTOFF = 0
    s = Species.objects.get(ncbi_taxonomy_id=species)
    tf = regulator
    gre_ids = list(set([o.gre_id for o in greTF.objects.filter(tf=tf, score__gte=CUTOFF)]))
    gres = Gre.objects.filter(id__in=gre_ids)

    corems = list(set(Corem.objects.filter(gres__in=gres)))
    corem_pval = GreCoremMembership.objects.filter(corem__in=corems, gre_id__in=gres)
    genes = list(set(Gene.objects.filter(gre__in=gres)))
    gene_pval = GreGeneMembership.objects.filter(gene__in=genes, gre_id__in=gres)
    conds = list(set(Condition.objects.filter(gre__in=gres)))
    conds_pval = GreConditionMembership.objects.filter(cond_id__in=conds, gre_id__in=gres)

    greObjs = [greObject(species, tf, gre) for gre in gres]
    return render_to_response('regulator_detail.html', locals())

def search(request):
    SolrGene = collections.namedtuple('SolrGene', ['species', 'species_taxid', 'sys_name', 'name', 'description', 'num_conditions', 'num_corems', 'num_gres'])
    if 'search_query' in request.GET:
        query = request.GET['search_query']
        solr_docs, facets = solr.search(query)
        print "FACETS: ", facets
        search_terms = query
        docs = []
        for doc in solr_docs:
            num_corems = 0
            num_conds = 0
            num_gres = 0

            if 'num_conds' in doc:
                num_conds = doc['num_conds']
            if 'num_corems' in doc:
                num_corems = doc['num_corems']
            if 'num_gres' in doc:
                num_gres = doc['num_gres']

            docs.append(SolrGene(doc['species'],
                                 doc['ncbi_taxonomy_id'],
                                 doc['sys_name'],
                                 doc['name'],
                                 doc['description'],
                                 num_conds,
                                 num_corems,
                                 num_gres))
        return render_to_response('search_results.html', locals())
    else:
        return render_to_response('search.html', locals())

def sitemap(request):
    return render_to_response('sitemap.html', locals())

def species(request, species=None):
    # Return info about the organism
    if species:
        species_objs = [Species.objects.get(ncbi_taxonomy_id=species)]
    else:
        species_objs = Species.objects.all()
        
    out = {}
    for s in species_objs:
        n = Network.objects.get(species__name=s.name)
        g = Gene.objects.filter(species__name=s.name).count()
        cond = Condition.objects.filter(network__name=n.name).count()
        corems = Corem.objects.filter(network__name=n.name).count()
        gres = Gre.objects.filter(network__name=n.name).count()-1 # exclude eco_0 and hal_0, should to this more robust in future
        out[s.short_name] = {"species":s,"network":n,"genes":g,
                             "conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('species.html', locals())

def gres(request):
    species = Species.objects.all()
    out = {}
    for s in species:
        n = Network.objects.get(species__name=s.name)
        gres = Gre.objects.filter(network__name=n.name).exclude(gre_id=s.short_name+"_0").count()
        out[s.short_name] = {"species":s,"network":n,"gres":gres}
    return render_to_response('gres.html', locals())


def gres_json_generic(query, species, display_start, display_length, sEcho):
    display_end = display_start + display_length
    num_total = query.count()
    batch = query if display_length == -1 else query[display_start:display_end]

    gres = [[gre_detail_link(species, item.gre.gre_id, item.gre.gre_id),
              item.p_val,
             ('<img src="%simages/gres/%s/%s.png" background-color="black" width="220" height="120" class="float-center" />' % (STATIC_URL, species, item.gre.gre_id))]
             for item in batch]

    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': gres
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


def corem_gres_json(request, species, corem):
    fields = ['gre__gre_id', 'p_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field = get_sort_field(request, fields, fields[0])

    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = GreCoremMembership.objects.filter(corem=corem).order_by(sort_field)
    return gres_json_generic(query, species, display_start, display_length, sEcho)

def gene_gres_json(request, species, gene):
    fields = ['gre__gre_id', 'p_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field = get_sort_field(request, fields, fields[0])

    query = GreGeneMembership.objects.filter(gene__sys_name=gene).order_by(sort_field)
    return gres_json_generic(query, species, display_start, display_length, sEcho)

def condition_gres_json(request, species, condition):
    fields = ['gre__gre_id', 'p_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    query = GreConditionMembership.objects.filter(cond__cond_id=condition).order_by(sort_field)
    return gres_json_generic(query, species, display_start, display_length, sEcho)

@page_template("gres_page.html")
def gres_s(request, template = "gres_s.html", species=None, extra_context=None):
    # Return info about gres
    class greObject:
        def __init__(self, species, gre):
            self.species = species
            self.gre_id = gre.gre_id
            self.cres = Cre.objects.filter(gre_id = gre).count()
            #self.pssm = gre.pssm.matrix()
            self.is_pal = gre.is_pal
            self.pal_pval = gre.pal_pval

    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    n = Network.objects.filter(species=species_obj)

    gres = Gre.objects.filter(network__in=n).exclude(gre_id=species_obj.short_name+"_0")
    objects = [greObject(species_obj, gre) for gre in gres]
    context = {'objects': objects}
    if extra_context is not None:
        context.update(extra_context)
    return render_to_response(template, context,context_instance=RequestContext(request))

def gene_gres_json(request, species, gene):
    fields = ['gre__gre_id', 'p_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    query = GreGeneMembership.objects.filter(gene__sys_name=gene).order_by(sort_field)
    return gres_json_generic(query, species, display_start, display_length, sEcho)


@page_template("gres_detail_page.html")
def gre_detail(request, template = "gre_detail.html",species=None, gre=None,extra_context=None):
    s = Species.objects.get(ncbi_taxonomy_id=species)
    gre = Gre.objects.get(gre_id=gre,network__species__ncbi_taxonomy_id=species)
    genes = Gene.objects.filter(gre=gre)
    biclusters = Bicluster.objects.filter(gres=gre)
    return render_to_response(template, locals(),context_instance=RequestContext(request))


def gre_cres_json(request, species, gre):
    def bicluster_id(cre_id):
        comps = cre_id.split("_")
        return '%s_%s' % (comps[0], comps[1])

    fields = ['cre_id', 'cre_id', 'cre_id', 'e_val']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    query = Cre.objects.filter(gre__gre_id=gre).order_by(sort_field)
    display_end = display_start + display_length
    num_total = query.count()
    batch = query if display_length == -1 else query[display_start:display_end]

    cres = [[item.cre_id,
             bicluster_detail_link(species, bicluster_id(item.cre_id), bicluster_id(item.cre_id)),
             ('<img src="%simages/cres/%s/%s.png" background-color="black" width="220" height="120" class="float-center" />' % (STATIC_URL, species, item.cre_id)),
             item.e_val
             ]
             for item in batch]

    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': cres
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

def biclusters(request, species=None):
    # Return info about biclusters
    class BCInfo:
        def __init__(self, network):
            network_obj = Network.objects.get(version_id=network)
            self.network_version = network_obj.version_id
            self.species_name = network_obj.species.name
            self.ncbi_taxonomy_id = network_obj.species.ncbi_taxonomy_id
            self.bcs_count = Bicluster.objects.filter(network=network_obj).count

    if species:
        networks = [i.version_id
                    for i in Network.objects.filter(species__ncbi_taxonomy_id=species)]
    else:
        networks = [n.version_id for n in Network.objects.all()]
    out = [BCInfo(network) for network in networks]
    return render_to_response('biclusters.html', locals())

def biclusters_s(request, species=None):
    # Return info about biclusters
    class bcObject:
        def __init__(self,species, bicluster):
            self.species = species
            self.network = Network.objects.filter(species=self.species)
            self.bc = bicluster

    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    return render_to_response('biclusters_s.html', locals())

def bicluster_detail_link(species, bicluster_id, label):
    return '<a href="%s">%s</a>' % (reverse('bicluster_detail',
                                            args=[species, bicluster_id]), label)
def biclusters_json(request, species=None):
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length

    n = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    bicluster_objs = Bicluster.objects.filter(network__in=n)[display_start:display_end]

    num_total = Bicluster.objects.filter(network__in=n).count()
    biclusters = [[b.network.version_id,
                   bicluster_detail_link(species, b.bc_id, b.bc_id),
                   b.genes.count(), b.conditions.count(), b.cres.count(),
                   b.corems.count(), b.gres.count()]
                  for b in bicluster_objs]

    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


def biclusters_json_generic(query, display_start, display_length, sEcho):
    """all Bicluster JSON subqueries have the same generic structure"""
    display_end = display_start + display_length
    num_total = query.count()
    bicluster_batch = query if display_length == -1 else query[display_start:display_end]

    biclusters = [[bicluster_detail_link(species, b.bc_id, b.bc_id),
                   b.residual, b.genes.count(), b.conditions.count()]
                  for b in bicluster_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


def corem_biclusters_json(request, species=None, corem=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field = get_sort_field(request, fields, fields[0])

    networks = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = Bicluster.objects.filter(corems=corem).order_by(sort_field)
    return biclusters_json_generic(query, display_start, display_length, sEcho)


def condition_biclusters_json(request, species=None, condition=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field = get_sort_field(request, fields, fields[0])

    s = Species.objects.get(ncbi_taxonomy_id=species)
    condition = Condition.objects.get(cond_id=condition,network__species=s)
    query = Bicluster.objects.filter(conditions=condition).order_by(sort_field)
    return biclusters_json_generic(query, display_start, display_length, sEcho)


def gene_biclusters_json(request, species=None, gene=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    sort_field = get_sort_field(request, fields, fields[0])

    s = Species.objects.get(ncbi_taxonomy_id=species)
    query = Bicluster.objects.filter(genes__sys_name=gene).order_by(sort_field)
    return biclusters_json_generic(query, display_start, display_length, sEcho)


def bicluster_detail(request, species=None, bicluster=None):
    # Return info about bicluster
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    bc = Bicluster.objects.get(bc_id = bicluster,network__species=s)
    genes = Gene.objects.filter(bicluster=bc)
    conds = Condition.objects.filter(bicluster=bc)
    corems = Corem.objects.filter(bicluster=bc)
    cres = Cre.objects.filter(bicluster=bc)
    gres = Gre.objects.filter(bicluster=bc)
    return render_to_response('bicluster_detail.html', locals())
