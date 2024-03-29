from django.shortcuts import render_to_response
from endless_pagination.decorators import page_template
from django.template import RequestContext
from django.http import HttpResponse
import simplejson
from django.core.urlresolvers import reverse

from django.db import connection, transaction
from django.db.models import Count
from .models import *
import collections
import solr
from django.conf import settings

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
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

def conditions_json_generic(query, species, dtparams):
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    conds = [[condition_detail_link(species, item.cond.cond_id, item.cond.cond_id),
              item.cond.cond_name,
              float(item.p_val)] for item in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': conds
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def corem_conditions_json(request, species, corem):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = CoremConditionMembership.objects.filter(corem=corem)
    return conditions_json_generic(query, species, dtparams)


def gene_conditions_json(request, species, gene):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GeneConditionMembership.objects.filter(gene__sys_name=gene)
    return conditions_json_generic(query, species, dtparams)

def gre_conditions_json(request, species, gre):
    fields = ['cond__cond_id', 'cond__cond_name', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreConditionMembership.objects.filter(gre__gre_id=gre)
    return conditions_json_generic(query, species, dtparams)

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
on c.id = cg.corem_id group by c.id, c.network_id, c.corem_id) as q1 left outer join
(select ccm.corem_id, count(ccm.cond_id) as num_conditions
from %scoremconditionmembership ccm group by ccm.corem_id) as q2
on q1.corem_id = q2.corem_id left outer join
(select gcm.corem_id, count(gcm.gre_id) as num_gres
from %sgrecoremmembership gcm group by gcm.corem_id) as q3
on q1.corem_id = q3.corem_id""" % (settings.TABLE_PREFIX, settings.TABLE_PREFIX,
	settings.TABLE_PREFIX, settings.TABLE_PREFIX)

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
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def corems_json_generic(query, species, dtparams):
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    corems = [[corem_detail_link(species, item.corem.corem_id, item.corem.corem_id),
               float(item.p_val)] for item in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': corems
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

    
def condition_corems_json(request, species, condition):
    fields = ['corem__corem_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = CoremConditionMembership.objects.filter(cond__cond_id=condition)
    return corems_json_generic(query, species, dtparams)

def gre_corems_json(request, species, gre):
    fields = ['corem__corem_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreCoremMembership.objects.filter(gre__gre_id=gre)
    return corems_json_generic(query, species, dtparams)

def genes_json_generic(request, species_obj, query):
    species = species_obj.ncbi_taxonomy_id
    fields = ['species', 'sys_name', 'name', 'accession', 'description', 'start', 'stop', 'strand', 'refseq']
    dtparams = get_dtparams(request, fields, fields[0])
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    genes = [[species_detail_link(species, species_obj.name),
              gene_detail_link(species, item.sys_name, item.sys_name),
              item.name,
              ncbi_accession_link(item.accession),
              item.description, item.start, item.stop, item.strand,
              ncbi_chromosome_link(item.chromosome.refseq)]
             for item in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': genes
        }
    return simplejson.dumps(data)

def condition_genes_json(request, species, condition):
    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    query = Gene.objects.filter(conditions__cond_id=condition)
    return HttpResponse(genes_json_generic(request, species_obj, query), content_type='application/json')

def gre_genes_json(request, species, gre):
    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    query = Gene.objects.filter(gre__gre_id=gre)
    return HttpResponse(genes_json_generic(request, species_obj, query), content_type='application/json')

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
    dtparams = get_dtparams(request, fields, fields[0])
    corem = Corem.objects.get(corem_id=corem, network__species__ncbi_taxonomy_id=species)
    query = CoremGOMembership.objects.filter(corem=corem)
    num_total = query.count()
    batch = dtparams.ordered_batch(query)    
    gos = [[amigo_link(g.go.go_id),g.go.term,g.go.ontology,g.genes_annotated,float(g.p_val)]
           for g in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': gos
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

def downloads(request):
    s = Species.objects.all()
    return render_to_response('downloads.html', locals())

def gene_detail_link(species, sys_name, label):
    return '<a href="%s">%s</a>' % (reverse('gene_detail',
                                            args=[species, sys_name]), label)
def genes_json(request, species):
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome']
    dtparams = get_dtparams(request, fields, fields[0])
    query = Gene.objects.filter(species__ncbi_taxonomy_id=species)
    num_total = query.count()
    batch = dtparams.ordered_batch(query)

    genes = [[gene_detail_link(species, g.sys_name, g.sys_name),
              g.name,
              ncbi_accession_link(g.accession),
              g.description, g.start, g.stop,
              g.strand,
              ncbi_chromosome_link(g.chromosome.refseq)] for g in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': genes
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')



def genes_json_annotation(request, species):
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome']
    dtparams = get_dtparams(request, fields, fields[0])
    query = Gene.objects.filter(species__ncbi_taxonomy_id=species)
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
	
    some_data_to_dump = [{
   'start': g.start,
   'end': g.stop,
   'strand': g.strand,
   'attributes': g.description,
   'type': "gene",
} for g in batch]

    data = {
        'SequenceAnnotation': some_data_to_dump
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

# including chr to filter query - dsalvanha
def genes_json_annotation_range(request, species, start, stop, refseq):
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome']
    dtparams = get_dtparams(request, fields, fields[0])
    chr_id = Chromosome.objects.filter(refseq=refseq)
    query = Gene.objects.filter(species__ncbi_taxonomy_id=species, start__gte=start, stop__lte=stop, chromosome=chr_id[0].id)
    #query = Gene.objects.filter(species__ncbi_taxonomy_id=species, start__range=[start, start + str(5000)])
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    
    some_data_to_dump = [{
   'name' : g.name,
   'sys_name' : g.sys_name,
   'start': g.start,
   'end': g.stop,
   'strand': g.strand,
   'attributes': g.description,
   'type': "gene",
   'basepairs': g.chromosome.sequence[g.start:g.stop],
   #'bc': [b.bc_id for b in g.bicluster_set.all()][:10],
   
} for g in batch]

    data = {
        'SequenceAnnotation': some_data_to_dump
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def basepair_jsons_range(request, species, start, stop, refseq_):
    fields = ['sequence']
    dtparams = get_dtparams(request, fields, fields[0])
    
    query = Chromosome.objects.filter(refseq=refseq_)
    print "param: ", refseq_
    for c in query:
        print "chromosome: ", c.refseq
    #this query = Gene.objects.filter(species__ncbi_taxonomy_id=species, start__gte=start, stop__lte=stop)
    #query = Gene.objects.filter(species__ncbi_taxonomy_id=species, start__range=[start, start + str(5000)])
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    
    some_data_to_dump = [{
   'start':int(start),
   'stop':int(stop),
   'basepairs': g.sequence[int(start):int(stop)],
} for g in batch]

    data = {
        'Basepairs_range': some_data_to_dump
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

def corem_genes_json(request, species=None, corem=None):
    """corem-specific gene list"""
    fields = ['sys_name', 'name', 'accession', 'description', 'start', 'stop',
              'strand', 'chromosome__refseq']
    dtparams = get_dtparams(request, fields, fields[0])
    corem = Corem.objects.get(corem_id=corem, network__species__ncbi_taxonomy_id=species)
    s = Species.objects.get(ncbi_taxonomy_id=species)
    query = Gene.objects.filter(corem=corem, species=s)
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    genes = [[gene_detail_link(species, g.sys_name, g.sys_name),
              g.name,
              ncbi_accession_link(g.accession),
              g.description, g.start, g.stop,
              g.strand,
              ncbi_chromosome_link(g.chromosome.refseq)] for g in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': genes
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

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


def coremToJSON(request,species=None):
    # get info about all regulators
    #s = Corem.objects.filter(network=network_id)
    corem = Corem.objects.filter(network__species__ncbi_taxonomy_id=species)
    #out = [regulators(species, tf) for tf in tfs]
    #print "------------> ",gre_[0]
    some_data_to_dump = [{
    'corem_name': g.corem_id
    } for g in corem]
    #print "########### ",some_data_to_dump

    return HttpResponse(simplejson.dumps(some_data_to_dump), content_type='application/json')  

def regulatorsToJSON(request,species=None):
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
    gre_ = list(set([o for o in greTF.objects.all()]))
    s = Species.objects.get(ncbi_taxonomy_id=species)
    out = [regulators(species, tf) for tf in tfs]
    #print "------------> ",gre_[0]
    
    some_data_to_dump = [{
    'gre_name': g.gre.gre_id,
    'tf': g.tf,
    'regulondb_id':g.regulondb_id
    } for g in gre_]
    #print "########### ",some_data_to_dump

    return HttpResponse(simplejson.dumps(some_data_to_dump), content_type='application/json')    
    #return render_to_response('regulators.html', locals())
    #return HttpResponse(simplejson.dumps(data), content_type='application/json')    

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


def gres_json_generic(query, species, dtparams):
    #display_end = display_start + display_length
    num_total = query.count()
    #batch = query if display_length == -1 else query[display_start:display_end]
    batch = dtparams.ordered_batch(query)

    gres = [[gre_detail_link(species, item.gre.gre_id, item.gre.gre_id),
              float(item.p_val),
             ('<img src="%simages/gres/%s/%s.png" background-color="black" width="220" height="120" class="float-center" />' % (settings.STATIC_URL, species, item.gre.gre_id))]
             for item in batch]

    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': gres
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')

def cres_in_range_json(request, species, start, stop, top, gene_name, refseq): #dsalvanha
    network = Network.objects.get(species__ncbi_taxonomy_id = species);

    chr_id = Chromosome.objects.filter(refseq=refseq)
    corem = Corem.objects.filter(genes__sys_name=str(gene_name))
    corem_ = [cor.id for cor in corem]
    top_ = int(top)
    
    if corem.count() > 0:
        everything = cres_in_range(network.id, chr_id[0].id, int(start), int(stop), None)
        gres = [cres_in_range(network.id, chr_id[0].id, start, stop, top=top_, corem_id=corem_id) for corem_id in corem_]
        gre_keys = set()
        for elem in gres:
            for key in elem[0].keys():
                gre_keys.add(key)

        gre_counts = everything[0]
        delkeys = [key for key in gre_counts if key not in gre_keys]
        for key in delkeys:
            del gre_counts[key]
    else:
        everything = cres_in_range(network.id, chr_id[0].id, int(start), int(stop), top_)

    result = everything
    return HttpResponse(simplejson.dumps(result), content_type='application/json')

#cres_in_gene_all
def cres_in_range_json_gene_all(request,gene_name): #dsalvanha 13/Jan/14
    #print "gene_name =-___-----------> ", genebla
    data = cres_in_gene_all(gene_name=gene_name)
    return HttpResponse(data, content_type='application/json')

def cres_in_range_json_gene_corem(request, gene_name): #dsalvanha 13/Jan/14
    data = cres_in_gene_corems(gene_name=gene_name)
    return HttpResponse(data, content_type='application/json')            








def cres_in_range_json_list(request, species, start, stop, top, gene_name, refseq): #dsalvanha Nov/27
    network = Network.objects.get(species__ncbi_taxonomy_id=species)

    chr_id = Chromosome.objects.filter(refseq=refseq)
    #gene = Gene.objects.filter(species__ncbi_taxonomy_id=species, name=gene_name);
    corem = Corem.objects.filter(genes__sys_name=str(gene_name))
    #cre_ids = [b.bc_id for b in corem.bicluster_set.all()];
    #cre_ids = gene.bicluster_set.all();
    # Wei-Ju g = Gene.objects.get(sys_name='b0035')
    #cre_ids = [cre.pr for cre in [b.cres for c in g.corem_set.all() for b in c.bicluster_set.all()]]

    # Wei-Ju cre_ids = [cre.id for c in g.corem_set.all() for b in c.bicluster_set.all() for cre in b.cres.all()]
    corem_ = [cor.id for cor in corem.all()]
    top_ = int(top)
    for corem_id in corem_:
        print "start: %s stop: %s top: %s corem_id: %s"  % (str(start), str(stop), str(top_), str(corem_id))

    cres = [cres_in_range(network.id, chr_id[0].id, start, stop, top=top_, corem_id=corem_id) for corem_id in corem_]
    corem_name = [cor.corem_id for cor in corem.all()]
    cor_id = [cor.id for cor in corem.all()]
    print "ids corem: --> " , cor_id
    print corem_name

    data = {
        'corem_name': corem_name,
        'cre_data':cres

    }

    #cre_ids = [b.bc_id for b in c.bicluster_set.all() for c in g.corem_set.all()]
    #cre_ids = [c.bicluster_set.all() for c.bc_id in g.corem_set.all()]


    # this function is used to add CoremData to visualization - dsalvanha Jan/9
    return HttpResponse(simplejson.dumps(data), content_type='application/json')    

def cres_in_range_given_corem(request, species, start, stop, top, coremName, refseq): #dsalvanha Jan/9 
    network = Network.objects.get(species__ncbi_taxonomy_id=species)

    chr_id = Chromosome.objects.filter(refseq=refseq)
    #gene = Gene.objects.filter(species__ncbi_taxonomy_id=species, name=gene_name);
    #corem = Corem.objects.filter(genes__sys_name=str(gene_name))
    corem = Corem.objects.filter(corem_id=str(coremName))

    if len(corem) != 0:

    #cre_ids = [b.bc_id for b in corem.bicluster_set.all()];
    #cre_ids = gene.bicluster_set.all();
    # Wei-Ju g = Gene.objects.get(sys_name='b0035')
    #cre_ids = [cre.pr for cre in [b.cres for c in g.corem_set.all() for b in c.bicluster_set.all()]]

    # Wei-Ju cre_ids = [cre.id for c in g.corem_set.all() for b in c.bicluster_set.all() for cre in b.cres.all()]
        corem_ = [cor.id for cor in corem.all()]
        top_ = int(top)
        for corem_id in corem_:
            print "start: %s stop: %s top: %s corem_id: %s"  % (str(start), str(stop), str(top_), str(corem_id))

        cres = cres_in_range(network.id, chr_id[0].id, start, stop, top=top_, corem_id=corem_id)
        corem_name = [cor.corem_id for cor in corem.all()]
    #cor_id = [cor.id for cor in corem.all()]
        print cres
        print "call for individual Corem"
        print "start ", start, "stop ", stop
    #print "ids corem: --> " , cor_id
        print corem_name

        data = {
            'corem_name': corem_name,
            'cre_data':cres
        }
    else:
        data = {
            'corem_name': [],
            'cre_data':[]
        }
    #cre_ids = [b.bc_id for b in c.bicluster_set.all() for c in g.corem_set.all()]
    #cre_ids = [c.bicluster_set.all() for c.bc_id in g.corem_set.all()]

    return HttpResponse(simplejson.dumps(data), content_type='application/json')    

def corem_gres_json(request, species, corem):
    fields = ['gre__gre_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = GreCoremMembership.objects.filter(corem=corem)
    return gres_json_generic(query, species, dtparams)

def gene_gres_json(request, species, gene):
    fields = ['gre__gre_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreGeneMembership.objects.filter(gene__sys_name=gene)
    return gres_json_generic(query, species, dtparams)

def condition_gres_json(request, species, condition):
    fields = ['gre__gre_id', 'p_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = GreConditionMembership.objects.filter(cond__cond_id=condition)
    return gres_json_generic(query, species, dtparams)

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
            self.pal_pval = format(round(gre.pal_pval,4))

    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    n = Network.objects.filter(species=species_obj)

    gres = Gre.objects.filter(network__in=n).exclude(gre_id=species_obj.short_name+"_0")
    objects = [greObject(species_obj, gre) for gre in gres]
    context = {'objects': objects}
    if extra_context is not None:
        context.update(extra_context)
    return render_to_response(template, context,context_instance=RequestContext(request))


@page_template("gres_detail_page.html")
def gre_detail(request, template = "gre_detail.html",species=None, gre=None,extra_context=None):
    s = Species.objects.get(ncbi_taxonomy_id=species)
    gre = Gre.objects.get(gre_id=gre,network__species__ncbi_taxonomy_id=species)
    return render_to_response(template, locals(),context_instance=RequestContext(request))


def gre_cres_json(request, species, gre):
    def bicluster_id(cre_id):
        comps = cre_id.split("_")
        return '%s_%s' % (comps[0], comps[1])

    fields = ['cre_id', 'cre_id', 'cre_id', 'e_val']
    dtparams = get_dtparams(request, fields, fields[0])
    query = Cre.objects.filter(gre__gre_id=gre)
    num_total = query.count()
    batch = dtparams.ordered_batch(query)

    cres = [[item.cre_id,
             bicluster_detail_link(species, bicluster_id(item.cre_id), bicluster_id(item.cre_id)),
             ('<img src="%simages/cres/%s/%s.png" background-color="black" width="220" height="120" class="float-center" />' % (settings.STATIC_URL, species, item.cre_id)),
             float(item.e_val)
             ] for item in batch]

    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': cres
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


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
    fields = ['bc_id']
    dtparams = get_dtparams(request, fields, fields[0])
    n = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    query = Bicluster.objects.filter(network__in=n)
    batch = dtparams.batch(query)
    num_total = query.count()
    biclusters = [[b.network.version_id,
                   bicluster_detail_link(species, b.bc_id, b.bc_id),
                   b.genes.count(), b.conditions.count(), b.cres.count(),
                   b.corems.count(), b.gres.count()-1]
                  for b in batch] # hardcoded removal of gre_0, need to make more robust

    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def biclusters_json_generic(query, species, dtparams):
    """all Bicluster JSON subqueries have the same generic structure"""
    num_total = query.count()
    batch = dtparams.ordered_batch(query)
    biclusters = [[bicluster_detail_link(species, b.bc_id, b.bc_id),
                   float(b.residual), b.genes.count(), b.conditions.count()]
                  for b in batch]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def corem_biclusters_json(request, species=None, corem=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    dtparams = get_dtparams(request, fields, fields[0])
    networks = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    query = Bicluster.objects.filter(corems=corem)
    return biclusters_json_generic(query, species, dtparams)


def condition_biclusters_json(request, species=None, condition=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    dtparams = get_dtparams(request, fields, fields[0])
    s = Species.objects.get(ncbi_taxonomy_id=species)
    condition = Condition.objects.get(cond_id=condition,network__species=s)
    query = Bicluster.objects.filter(conditions=condition)
    return biclusters_json_generic(query, species, dtparams)


def gene_biclusters_json(request, species=None, gene=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    dtparams = get_dtparams(request, fields, fields[0])
    query = Bicluster.objects.filter(genes__sys_name=gene)
    return biclusters_json_generic(query, species, dtparams)


def gre_biclusters_json(request, species=None, gre=None):
    fields = ['bc_id', 'residual', 'num_genes', 'num_conds']
    dtparams = get_dtparams(request, fields, fields[0])

    # 1. grab number of biclusters
    cur = connection.cursor()
    cur.execute("select count(distinct bcr.bicluster_id) from main_cre c join main_gre g on c.gre_id = g.id join main_bicluster_cres bcr on c.id = bcr.cre_id where g.gre_id = %s", [gre])
    num_total = cur.fetchone()[0]
    cur.close()

    # 2. grab the bicluster batch
    cur = connection.cursor()
    cur.execute("select distinct b.id, b.bc_id, b.residual from main_cre c join main_gre g on c.gre_id = g.id join main_bicluster_cres bcr on c.id = bcr.cre_id join main_bicluster b on b.id = bcr.bicluster_id where g.gre_id = %s order by b.id limit %s offset %s", [gre, dtparams.display_length, dtparams.display_start])
    biclusters = [(id, bc_id, float(residual)) for id, bc_id, residual in cur.fetchall()]
    bicluster_ids = [b[0] for b in biclusters]
    bid_list = ','.join(map(str, bicluster_ids))
    cur.close()

    # 3. grab gene counts
    cur = connection.cursor()
    cur.execute("select bicluster_id, count(gene_id) from main_bicluster_genes where bicluster_id in (" + bid_list + ") group by bicluster_id")
    gene_counts = [num_genes for bid, num_genes in cur.fetchall()]
    cur.close()

    # 4. grab condition counts
    cur = connection.cursor()
    cur.execute("select bicluster_id, count(condition_id) from main_bicluster_conditions where bicluster_id in (" + bid_list + ") group by bicluster_id")
    cond_counts = [num_conds for bid, num_conds in cur.fetchall()]
    cur.close()
    
    biclusters = [[bicluster_detail_link(species, b[1], b[1]),
                   b[2], gene_counts[i], cond_counts[i]]
                  for i, b in enumerate(biclusters)]
    data = {
        'sEcho': dtparams.sEcho,
        'iTotalRecords': num_total, 'iTotalDisplayRecords': num_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


def bicluster_detail(request, species=None, bicluster=None):
    # Return info about bicluster
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    bc = Bicluster.objects.get(bc_id = bicluster,network__species=s)
    genes = Gene.objects.filter(bicluster=bc)
    conds = Condition.objects.filter(bicluster=bc)
    corems = Corem.objects.filter(bicluster=bc)
    cres = Cre.objects.filter(bicluster=bc)
    gres = [cre.gre for cre in cres]
    return render_to_response('bicluster_detail.html', locals())
