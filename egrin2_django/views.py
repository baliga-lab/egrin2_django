from django.shortcuts import render_to_response
from endless_pagination.decorators import page_template
from django.template import RequestContext
from models import *

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


def conditions(request, species=None):
    # Return info about conditions
    class ConditionInfo:
        def __init__(self, condition):
            self.cond_id = condition.cond_id
            self.cond_name = condition.cond_name
            self.corem_count = condition.corems.count
            self.gene_count = condition.gene_set.count
            self.gre_count = condition.gre_set.count

    class SpeciesConditionInfo:
        def __init__(self,species):
            species_obj = Species.objects.get(ncbi_taxonomy_id=species)
            self.species_name = species_obj.name
            self.ncbi_taxonomy_id = species_obj.ncbi_taxonomy_id
            network = Network.objects.filter(species__ncbi_taxonomy_id=species)
            self.conds = [ConditionInfo(cond)
                          for cond in Condition.objects.filter(network__in=network)[0:10]]
    if species:
        out = []
        out.append(SpeciesConditionInfo(species))
    else:
        species = [i.ncbi_taxonomy_id for i in Species.objects.all()]
        out = []
        for i in species:
            out.append(SpeciesConditionInfo(i))
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

def corems(request, species=None):
    # Return info about corems
    class CoremInfo:
        def __init__(self, corem):
            self.corem_id = corem.corem_id
            self.gene_count = corem.genes.count
            self.condition_count = corem.conditions.count
            self.gre_count = corem.gres.count
            
    class SpeciesCoremInfo:
        def __init__(self,species):
            species_obj = Species.objects.get(ncbi_taxonomy_id=species)
            self.species_name = species_obj.name
            self.ncbi_taxonomy_id = species_obj.ncbi_taxonomy_id
            network = Network.objects.filter(species__ncbi_taxonomy_id=species)
            self.corems = [CoremInfo(corem)
                           for corem in Corem.objects.filter(network__in=network)]
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
            self.corem_pval = GreCoremPval.objects.get(corem=corem,gre_id=gre).p_val
            self.pssm = gre.pssm.matrix()
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    network = Network.objects.filter(species=s)
    corem = Corem.objects.get(corem_id = corem,network__species__ncbi_taxonomy_id=species)
    genes = Gene.objects.filter(corems=corem,species=s)
    conds = Condition.objects.filter(corems=corem)
    conds_pval = CoremConditionPval.objects.filter(corem=corem, 
                                                  cond_id__in = conds)
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond_id.cond_id,"cond_name":Condition.objects.get(cond_id = i.cond_id.cond_id).cond_name,"p_val":i.p_val}
        conds_pval_dict[i] = d
    gres = Gre.objects.filter(corems=corem)
    gre_obj = []
    for i in gres:
        gre_obj.append(greObject(species,i))
    biclusters = Bicluster.objects.filter(corems=corem,network__in=network)
    return render_to_response('corem_detail.html', locals())

def downloads(request):
    s = Species.objects.all()
    return render_to_response('downloads.html', locals())


def genes(request, species=None):
    # Return info about the genes
    class GeneInfo:
        def __init__(self,species):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.genes = Gene.objects.filter(species__ncbi_taxonomy_id=species)

    if species:
        out = []
        out.append(GeneInfo(species))
    else:
        species = [i.ncbi_taxonomy_id for i in Species.objects.all()]
        out = []
        for i in species:
            out.append(GeneInfo(i))
    return render_to_response('genes.html', locals())

def gene_detail(request, species=None, gene=None):
    # Return info about gene
    class greObject:
        def __init__(self,species,gre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.gre_id = gre.gre_id
            self.gene_pval = GreGenePval.objects.get(gene=g,gre_id=gre).p_val
            self.pssm = gre.pssm.matrix()
    g = Gene.objects.get(sys_name = gene)
    s = Species.objects.get(ncbi_taxonomy_id=species)
    corems = Corem.objects.filter(genes__sys_name = g.sys_name)
    conds = Condition.objects.filter(genes__sys_name = g.sys_name)
    conds_pval = GeneConditionPval.objects.filter(gene__sys_name = g.sys_name, 
                                                  cond_id__in = conds)
    # add cond name to conds_pval
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond_id.cond_id,"cond_name":Condition.objects.get(cond_id = i.cond_id.cond_id).cond_name,"p_val":i.p_val}
        conds_pval_dict[i] = d
    gres = Gre.objects.filter(genes=g)
    gre_obj = []
    for i in gres:
        gre_obj.append(greObject(species,i))
    biclusters = Bicluster.objects.filter(genes__sys_name = g.sys_name)
    return render_to_response('gene_detail.html', locals())

def networks(request, species=None):
    # Return info about the network
    if species:
        out = {}
        s = Species.objects.get(ncbi_taxonomy_id=species)
        n = Network.objects.get(species__name=s.name)
        g = len(Gene.objects.filter(species__name=s.name))
        cond = len(Condition.objects.filter(network__name=n.name))
        corems = len(Corem.objects.filter(network__name=n.name))
        gres = len(Gre.objects.filter(network__name=n.name))
        out[s.short_name] = {"species":s,"network":n,"genes":g,"conditions":cond,"corems":corems,"gres":gres}
    else:
        species = Species.objects.all()
        out = {}
        for i in species:
            s = i
            n = Network.objects.get(species__name=s.name)
            g = len(Gene.objects.filter(species__name=s.name))
            cond = len(Condition.objects.filter(network__name=n.name))
            corems = len(Corem.objects.filter(network__name=n.name))
            gres = len(Gre.objects.filter(network__name=n.name))
            out[s.short_name] = {"species":s,"network":n,"genes":g,"conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('networks.html', locals())

def regulators(request,species=None):
    # get info about all regulators
    class regulators:
        def __init__(self,species,tf):
            self.CUTOFF = .75
            self.s = Species.objects.get(ncbi_taxonomy_id=species)
            self.tf = tf
            self.gres = list(set([o.gre_id for o in greTF.objects.filter(tf=tf,score__gte=self.CUTOFF)]))
            self.corems = list(set(Corem.objects.filter(gre_ids__in=self.gres)))
            self.genes = list(set(Gene.objects.filter(gres__in=self.gres)))
            self.conds = list(set(Condition.objects.filter(gres__in=self.gres)))
    tfs = list(set([o.tf for o in greTF.objects.all()]))
    s = Species.objects.get(ncbi_taxonomy_id=species)
    out = []
    for i in tfs:
        out.append(regulators(species=species,tf=i))
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
    gres = list(set([o.gre_id for o in greTF.objects.filter(tf=tf,score__gte=CUTOFF)]))
    corems = list(set(Corem.objects.filter(gre_ids__in=gres)))
    corem_pval = GreCoremPval.objects.filter(corem__in=corems,gre_id__in=gres)
    genes = list(set(Gene.objects.filter(gres__in=gres)))
    gene_pval = GreGenePval.objects.filter(gene__in=corems,gre_id__in=gres)
    conds = list(set(Condition.objects.filter(gres__in=gres)))
    conds_pval = GreConditionPval.objects.filter(cond_id__in=conds,gre_id__in=gres)
    greObjs = []
    for i in gres:
        greObjs.append(greObject(species=species,tf=tf,gre=i))
    return render_to_response('regulator_detail.html', locals())

def search(request):
    return render_to_response('search.html', locals())

def sitemap(request):
    return render_to_response('sitemap.html', locals())

def species(request,species=None):
    # Return info about the organism
    if species:
        out = {}
        s = Species.objects.get(ncbi_taxonomy_id=species)
        n = Network.objects.get(species__name=s.name)
        g = len(Gene.objects.filter(species__name=s.name))
        cond = len(Condition.objects.filter(network__name=n.name))
        corems = len(Corem.objects.filter(network__name=n.name))
        gres = len(Gre.objects.filter(network__name=n.name))
        out[s.short_name] = {"species":s,"network":n,"genes":g,"conditions":cond,"corems":corems,"gres":gres}
    else:
        species = Species.objects.all()
        out = {}
        for i in species:
            s = i
            n = Network.objects.get(species__name=s.name)
            g = len(Gene.objects.filter(species__name=s.name))
            cond = len(Condition.objects.filter(network__name=n.name))
            corems = len(Corem.objects.filter(network__name=n.name))
            gres = len(Gre.objects.filter(network__name=n.name))
            out[s.short_name] = {"species":s,"network":n,"genes":g,"conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('species.html', locals())

def gres(request):
    species = Species.objects.all()
    out = {}
    for i in species:
        s = i
        n = Network.objects.get(species__name=s.name)
        g = len(Gene.objects.filter(species__name=s.name))
        cond = len(Condition.objects.filter(network__name=n.name))
        corems = len(Corem.objects.filter(network__name=n.name))
        gres = len(Gre.objects.filter(network__name=n.name))
        out[s.short_name] = {"species":s,"network":n,"genes":g,"conditions":cond,"corems":corems,"gres":gres}
    return render_to_response('gres.html', locals())
    
    
@page_template("gres_page.html")
def gres_s(request, template = "gres_s.html",species=None,extra_context=None):
    # Return info about gres
    class greObject:
        def __init__(self,species,gre):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.gre_id = gre.gre_id
            self.cres = len(Cre.objects.filter(gre_id = gre))
            self.pssm = gre.pssm.matrix()
    objects = []
    n = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    gres = Gre.objects.filter(network__in=n)
    for j in gres:
        objects.append(greObject(species=species,gre=j))
    context = {'objects':objects}
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
            self.eval = cre.eval
            self.pssm = cre.pssm.matrix()
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    gre = Gre.objects.get(gre_id = gre,network__species__ncbi_taxonomy_id=species)
    pssm = gre.pssm.matrix()
    genes = Gene.objects.filter(gres=gre)
    corems = Corem.objects.filter(gre_ids=gre)
    corem_pval = GreCoremPval.objects.filter(gre_id=gre, 
                                                  corem__in = corems)
    conds = Condition.objects.filter(gres=gre)
    conds_pval = GreConditionPval.objects.filter(gre_id=gre, 
                                                  cond_id__in = conds)
    conds_pval_dict = {}
    for i in conds_pval:
        d = {"cond_id":i.cond_id.cond_id,"cond_name":Condition.objects.get(cond_id = i.cond_id.cond_id).cond_name,"p_val":i.return_pval()}
        conds_pval_dict[i] = d
    biclusters = Bicluster.objects.filter(gre_ids=gre)
    cres = Cre.objects.filter(gre_id=gre)
    cre_dict = []
    for i in cres:
        cre_dict.append(creObject(species,i))
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
        networks = [i.version_id for i in Network.objects.filter(species__ncbi_taxonomy_id=species)]
        out = []
        for i in networks:
            out.append(BCInfo(i))
    else:
        networks = [i.version_id for i in Network.objects.all()]
        out = []
        for i in networks:
            out.append(BCInfo(i))
    return render_to_response('biclusters.html', locals())

@page_template("biclusters_page.html")
def biclusters_s(request, template = "biclusters_s.html",species=None,extra_context=None):
    # Return info about biclusters
    class bcObject:
        def __init__(self,species,bc):
            self.species = Species.objects.get(ncbi_taxonomy_id=species)
            self.network = Network.objects.filter(species=self.species)
            self.bc = Bicluster.objects.get(network__in=self.network,bc_id=bc)
    objects = []
    n = Network.objects.filter(species=Species.objects.get(ncbi_taxonomy_id=species))
    bcs = Bicluster.objects.filter(network__in=n)
    for j in bcs:
        objects.append(bcObject(species=species,bc=j.bc_id))
    context = {'objects':objects}
    if extra_context is not None:
        context.update(extra_context)
    return render_to_response(template, context,context_instance=RequestContext(request))

def bicluster_detail(request, species=None, bicluster=None):
    # Return info about bicluster
    # just to be sure
    s = Species.objects.get(ncbi_taxonomy_id=species)
    bc = Bicluster.objects.get(bc_id = bicluster,network__species=s)
    genes = Gene.objects.filter(bcs=bc)
    conds = Condition.objects.filter(bcs=bc)
    corems = Corem.objects.filter(top_bcs=bc)
    cres = Cre.objects.filter(bcs=bc)
    gres = Gre.objects.filter(bcs=bc)
    return render_to_response('bicluster_detail.html', locals())
