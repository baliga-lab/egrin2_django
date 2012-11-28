from django.shortcuts import render_to_response
from endless_pagination.decorators import page_template
from django.template import RequestContext
from django.http import HttpResponse
from django.utils import simplejson
from django.core.urlresolvers import reverse
from django.db.models import Count
from models import *
import collections
import solr

def index(request):
    species = Species.objects.count()
    networks = Network.objects.count()
    corems = Corem.objects.count()
    genes = Gene.objects.count()
    conditions = Condition.objects.count()
    gres = Gre.objects.count()
    biclusters = Bicluster.objects.count()
    tfs = len(list(set([o.tf for o in greTF.objects.all()])))
    return render_to_response('index.html', locals())

def about(request):
    return render_to_response('about.html', locals())

def browse(request):
    return render_to_response('browse.html', locals())

def condition_detail_link(species, cond_id, label):
    return '<a href="%s">%s</a>' % (reverse('condition_detail',
                                            args=[species, cond_id]), label)

def get_sort_field(request, fields, default_field):
    sort_field = default_field
    sort_dir = "asc"
    if "iSortCol_0" in request.GET:
        sort_field = fields[int(request.GET['iSortCol_0'])]
        
    if "sSortDir_0" in request.GET:
        sort_dir = request.GET['sSortDir_0']

    if sort_dir == 'asc':
        return sort_field
    else:
        return "-" + sort_field

def conditions_json(request, species):
    # TODO: note that we still need to figure out how to sort on a multi-valued
    # many-to-many aggregate (count(genes), count(gres))
    fields = ['cond_id', 'cond_name', 'corem_count']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    network = Network.objects.filter(species__ncbi_taxonomy_id=species)
    num_conds_total = Condition.objects.filter(network__in=network).count()
    conds_query = Condition.objects.filter(network__in=network).annotate(
        corem_count=Count('corems'))
    conds_query = conds_query.order_by(sort_field)

    conds_batch = conds_query[display_start:display_end]
    conds = [[condition_detail_link(species, c.cond_id, c.cond_id),
              c.cond_name,
              c.corem_count,
              c.gene_set.count(), c.gre_set.count()]
             for c in conds_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_conds_total, 'iTotalDisplayRecords': num_conds_total,
        'aaData': conds
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

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
    # Return info about conditions
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    condition = Condition.objects.get(cond_id = condition,network__species=s)
    genes = Gene.objects.filter(conditions=condition)
    corems = Corem.objects.filter(conditions=condition)
    corem_pval = CoremConditionMembership.objects.filter(cond_id=condition, 
                                                         corem__in=corems)
    gres_pval = GreConditionMembership.objects.filter(cond_id=condition)
    biclusters = Bicluster.objects.filter(conditions=condition)
    return render_to_response('condition_detail.html', locals())

def contact(request):
    return render_to_response('contact.html', locals())

def corem_detail_link(species, corem_id, label):
    return '<a href="%s">%s</a>' % (reverse('corem_detail',
                                            args=[species, corem_id]), label)

def corems_json(request, species):
    fields = ['corem_id', 'gene_count', 'condition_count', 'gre_count']
    sEcho = request.GET['sEcho']
    display_start = int(request.GET['iDisplayStart'])
    display_length = int(request.GET['iDisplayLength'])
    display_end = display_start + display_length
    sort_field = get_sort_field(request, fields, fields[0])

    network = Network.objects.filter(species__ncbi_taxonomy_id=species)
    num_corems_total = Corem.objects.filter(network__in=network).count()
    corems_query = Corem.objects.filter(network__in=network).annotate(
        gene_count=Count('genes')).annotate(
        condition_count=Count('conditions')).annotate(
            gre_count=Count('gres'))
    corems_query = corems_query.order_by(sort_field)
    print corems_query.query
    corems_batch = corems_query[display_start:display_end]
    corems = [[corem_detail_link(species, c.corem_id, c.corem_id),
               c.gene_count, c.condition_count, c.gre_count]
              for c in corems_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_corems_total, 'iTotalDisplayRecords': num_corems_total,
        'aaData': corems
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')

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
    # Return info about corem
    class greObject:
        def __init__(self,species,gre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.gre_id = gre.gre_id
            self.corem_pval = GreCoremMembership.objects.get(corem=corem,gre_id=gre).p_val
            #self.pssm = gre.pssm.matrix()
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    network = Network.objects.filter(species=s)
    corem = Corem.objects.get(corem_id=corem,network__species__ncbi_taxonomy_id=species)
    genes = Gene.objects.filter(corem=corem,species=s)
    conds = Condition.objects.filter(corems=corem)
    conds_pval = CoremConditionMembership.objects.filter(corem=corem, 
                                                         cond_id__in=conds)
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond.cond_id,"cond_name":Condition.objects.get(cond_id = i.cond.cond_id).cond_name,"p_val":i.p_val}
        conds_pval_dict[i] = d
    gres = Gre.objects.filter(corem=corem)
    gre_obj = [greObject(species, gre) for gre in gres]
    biclusters = Bicluster.objects.filter(corems=corem,network__in=network)
    return render_to_response('corem_detail.html', locals())

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

    num_genes_total = Gene.objects.filter(species__ncbi_taxonomy_id=species).count()
    genes_query = Gene.objects.filter(species__ncbi_taxonomy_id=species)
    genes_query = genes_query.order_by(sort_field)

    genes_batch = genes_query[display_start:display_end]
    genes = [[gene_detail_link(species, g.sys_name, g.sys_name),
              g.name,
              g.accession, g.description, g.start, g.stop,
              g.strand, g.chromosome.refseq] for g in genes_batch]
    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_genes_total, 'iTotalDisplayRecords': num_genes_total,
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
    # Return info about gene
    class greObject:
        def __init__(self,species,gre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.gre_id = gre.gre_id
            self.gene_pval = GreGeneMembership.objects.get(gene=g,gre_id=gre).p_val
            self.pssm = gre.pssm.matrix()

    g = Gene.objects.get(sys_name=gene)
    s = Species.objects.get(ncbi_taxonomy_id=species)
    corems = Corem.objects.filter(genes__sys_name=g.sys_name)
    conds = Condition.objects.filter(gene__sys_name = g.sys_name)
    conds_pval = GeneConditionMembership.objects.filter(gene__sys_name=g.sys_name, 
                                                        cond_id__in = conds)
    # add cond name to conds_pval
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond.cond_id,
             "cond_name":Condition.objects.get(cond_id = i.cond.cond_id).cond_name,
             "p_val":i.p_val}
        conds_pval_dict[i] = d
    gres = Gre.objects.filter(genes=g)
    gre_obj = [greObject(species, gre) for gre in gres]
    biclusters = Bicluster.objects.filter(genes__sys_name=g.sys_name)

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
        gres = Gre.objects.filter(network__name=n.name).count()
        out[s.short_name] = {"species":s,"network":n,"genes":g,
                             "conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('networks.html', locals())

def regulators(request,species=None):
    # get info about all regulators
    class regulators:
        def __init__(self,species,tf):
            self.CUTOFF = .75
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

    CUTOFF = .75
    s = Species.objects.get(ncbi_taxonomy_id=species)
    tf = regulator
    gre_ids = list(set([o.gre_id for o in greTF.objects.filter(tf=tf, score__gte=CUTOFF)]))
    gres = Gre.objects.filter(id__in=gre_ids)

    corems = list(set(Corem.objects.filter(gres__in=gres)))
    corem_pval = GreCoremMembership.objects.filter(corem__in=corems, gre_id__in=gres)
    genes = list(set(Gene.objects.filter(gre__in=gres)))
    gene_pval = GreGeneMembership.objects.filter(gene__in=corems, gre_id__in=gres)
    conds = list(set(Condition.objects.filter(gre__in=gres)))
    conds_pval = GreConditionMembership.objects.filter(cond_id__in=conds, gre_id__in=gres)

    greObjs = [greObject(species, tf, gre) for gre in gres]
    return render_to_response('regulator_detail.html', locals())

def search(request):
    SolrGene = collections.namedtuple('SolrGene', ['sys_name', 'species', 'num_conditions'])
    if 'search_query' in request.GET:
        query = request.GET['search_query']
        solr_docs, facets = solr.search(query)
        print "FACETS: ", facets
        search_terms = query
        docs = []
        for doc in solr_docs:
            if 'condition' in doc:
                num_conditions = len(doc['condition'])
            else:
                num_conditions = 0
            docs.append(SolrGene(doc['sys_name'], doc['short_name'],
                                 num_conditions))
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
        gres = Gre.objects.filter(network__name=n.name).count()
        out[s.short_name] = {"species":s,"network":n,"genes":g,
                             "conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('species.html', locals())

def gres(request):
    species = Species.objects.all()
    out = {}
    for s in species:
        n = Network.objects.get(species__name=s.name)
        gres = Gre.objects.filter(network__name=n.name).count()
        out[s.short_name] = {"species":s,"network":n,"gres":gres}
    return render_to_response('gres.html', locals())

@page_template("gres_page.html")
def gres_s(request, template = "gres_s.html", species=None, extra_context=None):
    # Return info about gres
    class greObject:
        def __init__(self, species, gre):
            self.species = species
            self.gre_id = gre.gre_id
            self.cres = Cre.objects.filter(gre_id = gre).count()
            #self.pssm = gre.pssm.matrix()

    species_obj = Species.objects.get(ncbi_taxonomy_id=species)
    n = Network.objects.filter(species=species_obj)

    gres = Gre.objects.filter(network__in=n)
    objects = [greObject(species_obj, gre) for gre in gres]
    context = {'objects': objects}
    if extra_context is not None:
        context.update(extra_context)
    return render_to_response(template, context,context_instance=RequestContext(request))

@page_template("gres_detail_page.html")
def gre_detail(request, template = "gre_detail.html",species=None, gre=None,extra_context=None):
    # Return info about gres
    class creObject:
        def __init__(self,species,cre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.cre_id = cre.cre_id
            self.bcs = cre.cre_id.split("_")[0]+"_"+cre.cre_id.split("_")[1]
            self.e_val = cre.e_val
            #self.pssm = cre.pssm.matrix()
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    gre = Gre.objects.get(gre_id=gre,network__species__ncbi_taxonomy_id=species)
    pssm = gre.pssm.matrix()
    genes = Gene.objects.filter(gre=gre)
    corems = Corem.objects.filter(gres=gre)
    corem_pval = GreCoremMembership.objects.filter(gre=gre, 
                                                  corem__in = corems)
    conds = Condition.objects.filter(gre=gre)
    conds_pval = GreConditionMembership.objects.filter(gre=gre, 
                                                       cond_id__in = conds)
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond.cond_id,
             "cond_name":Condition.objects.get(cond_id=i.cond.cond_id).cond_name,
             "p_val":i.return_pval()}
        conds_pval_dict[i] = d
    biclusters = Bicluster.objects.filter(gres=gre)
    cres = Cre.objects.filter(gre_id=gre)
    cre_dict = [creObject(species, cre) for cre in cres]
    return render_to_response(template, locals(),context_instance=RequestContext(request))

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
    num_biclusters_total = Bicluster.objects.filter(network__in=n).count()
    bicluster_objs = Bicluster.objects.filter(network__in=n)[display_start:display_end]
    biclusters = [[b.network.version_id,
                   bicluster_detail_link(species, b.bc_id, b.bc_id),
                   b.genes.count(), b.conditions.count(), b.cres.count(),
                   b.corems.count(), b.gres.count()]
                  for b in bicluster_objs]

    data = {
        'sEcho': sEcho,
        'iTotalRecords': num_biclusters_total, 'iTotalDisplayRecords': num_biclusters_total,
        'aaData': biclusters
        }
    return HttpResponse(simplejson.dumps(data), mimetype='application/json')


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
