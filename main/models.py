from django.db import models, connection
from numpy import  *

# Create your models here.
class Species(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=64)
    ncbi_taxonomy_id = models.IntegerField(blank=True, null=True)
    ucsc_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = "Species"

class Chromosome(models.Model):
    species = models.ForeignKey(Species)
    name = models.CharField(max_length=255)
    length = models.IntegerField()
    topology = models.CharField(max_length=64)
    refseq = models.CharField(max_length=64, blank=True, null=True)
    scaffoldId = models.IntegerField()
    sequence = models.TextField()
    
    def __unicode__(self):
        return self.name


    def subset(self, start, end):
        """returns a subsequence"""
        pass


class Network(models.Model):
    species = models.ForeignKey(Species)
    name = models.CharField(max_length=255)
    data_source = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    version_id = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    
    def __unicode__(self):
        return self.name



class Gene(models.Model):
    species = models.ForeignKey(Species)
    accession = models.CharField(max_length=128)
    gi = models.CharField(max_length=128)
    start = models.IntegerField()
    stop = models.IntegerField()
    strand = models.CharField(max_length=128)
    sys_name = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    chromosome = models.ForeignKey(Chromosome)

    # attributed many-to-many
    conditions = models.ManyToManyField('Condition', verbose_name = "condition membership",
                                        through='GeneConditionMembership')
    
    def __unicode__(self):
        return self.sys_name

    class Meta:
        ordering = ['sys_name']
    
class Condition(models.Model):
    network = models.ForeignKey(Network)
    cond_id = models.CharField(max_length=255)
    cond_name = models.CharField(max_length=128)
    corems = models.ManyToManyField('Corem', verbose_name="corem membership",
                                    through='CoremConditionMembership')
    
    def __unicode__(self):
        return str(self.cond_id)
    
    class Meta:

        ordering = ['cond_id']
    
class Expression(models.Model):
    gene = models.ForeignKey(Gene, verbose_name = "expressed gene")
    condition = models.ForeignKey(Condition, verbose_name = "expressed condition")
    value = models.DecimalField(max_digits=12, decimal_places=8)  # models.CharField(max_length=128)

    def __unicode__(self):
        return '%s : %s : %s' % (self.gene,self.condition,self.value)

    class Meta:

        ordering = ['gene']
        
class Pssm(models.Model):
    parent_id = models.CharField(max_length=128)
    #genes = models.ManyToManyField(Gene, verbose_name = "gene membership")
    #bcs = models.ManyToManyField('Bicluster', verbose_name = "bicluster membership")
    #corems = models.ManyToManyField('Corem', verbose_name = "corem membership")
    
    def matrix(self):
        # Get corresponding rows to return 
        l = Row.objects.filter(pssm__parent_id=self.parent_id)
        m = [ [ 0 for i in range(4) ] for j in range(len(l)) ]
        for i in range(len(l)):
            for j in range(4):
                if j == 0:
                    if float(l[i].a)==0:
                        m[i][j] = .25
                    else:
                        m[i][j] = float(l[i].a)+.25
                elif j == 1:
                    if float(l[i].c)==0:
                        m[i][j] = .25
                    else:
                        m[i][j] = float(l[i].c)+.25
                elif j == 2:
                    if float(l[i].g)==0:
                        m[i][j] = .25
                    else:
                        m[i][j] = float(l[i].g)+.25
                elif j == 3:
                    if float(l[i].t)==0:
                        m[i][j] = .25
                    else:
                        m[i][j] = float(l[i].t)+.25
        # re-normalize m
        m = array(m)
        m_new = m
        for i in range(0,len(m)):
            m_new[i] = array(m[i])/sum(array(m[i]))
        return array(m_new).tolist()
    
    def getEntropy(self,pssm):
        m = self.matrix()
        entr = []
        for i in range(0,len(m)):
            entr.append(-sum(array(m[i]) * log2(array(m[i]))))
        return entr
    
    def scaled_matrix(self):
        m = array(self.matrix())
        if sum(m <= 0)>0: 
            m = m + 1e-10
        if sum(m > 1)>0:
            m_new = m
            for i in range(0,len(m)):
                for j in range(0,len(m[i])):
                    m_new[i,j] = m[i,j]/(sum(m[i] + 1e-10))
        entr = self.getEntropy(m)
        scale_e = (2 - array(entr))/2
        pssm_sc = m
        for i in range(0,len(m)):
            pssm_sc[i] = scale_e[i] * array(m[i])
        return array(pssm_sc).tolist()

    def __unicode__(self):
        return '%s' % self.parent_id



class Row(models.Model):
    pssm = models.ForeignKey(Pssm, verbose_name = "pssm name")
    pos = models.IntegerField()
    a = models.DecimalField(max_digits=8, decimal_places=6)  # (max_digits=6, decimal_places=5)
    g = models.DecimalField(max_digits=8, decimal_places=6)  # (max_digits=6, decimal_places=5)
    c = models.DecimalField(max_digits=8, decimal_places=6)  # (max_digits=6, decimal_places=5)
    t = models.DecimalField(max_digits=8, decimal_places=6)  # (max_digits=6, decimal_places=5)
    
    def __unicode__(self):
        return '%s' % self.pos

    class Meta:

        ordering = ['pos']
    
class Gre(models.Model):
    network = models.ForeignKey(Network)
    gre_id = models.CharField(max_length=255)
    pssm = models.ForeignKey(Pssm, verbose_name = "PSSM matrix")
    p_val = models.DecimalField(max_digits=15, decimal_places=13)  # models.CharField(max_length=128)
    is_pal = models.BooleanField()
    pal_pval = models.DecimalField(max_digits=15, decimal_places=13)

    conditions = models.ManyToManyField(Condition, verbose_name = "Conditions members",
                                        through='GreConditionMembership')
    genes = models.ManyToManyField(Gene, verbose_name = "Genes members",
                                   through='GreGeneMembership')
    
    def __unicode__(self):
        return '%s' % self.gre_id
    


class GO(models.Model):
    go_id = models.CharField(max_length=255)
    ontology = models.CharField(max_length=255)
    term = models.TextField()
    definition = models.TextField()
    synonym = models.TextField()
    
    def __unicode__(self):
        return '%s' % self.go_id



class Cre(models.Model):
    network = models.ForeignKey(Network)
    cre_id = models.CharField(max_length=128)
    gre = models.ForeignKey(Gre, verbose_name = "GRE parent")
    pssm = models.ForeignKey(Pssm, verbose_name = "PSSM matrix")
    e_val = models.DecimalField(max_digits=16, decimal_places=4)  # models.CharField(max_length=128)
    
    def return_eval(self):
        return float(self.eval)
    
    def __unicode__(self):
        return '%s' % self.cre_id


# TODO: index main_crepos on start and stop
class CrePos(models.Model):
    network = models.ForeignKey(Network)
    cre = models.ForeignKey(Cre)
    start = models.IntegerField()
    stop = models.IntegerField()
    p_val = models.DecimalField(max_digits=16, decimal_places=4)

    def __unicode__(self):
        return '%s' % self.start

def cres_in_range(network_id, start, stop, top=None, corem_id=None, omit0=True):
    """
    1. -> { 'GRE1': [(1, 1231) (2, 232)], ... }
    2. -> [ (1, 1231)  (2, 232), ...]
    """
    cur = connection.cursor()
    org_query = "select short_name from main_network n join main_species s on n.species_id = s.id where n.id = %s"
    cur.execute(org_query, [network_id])
    orgcode = cur.fetchone()[0]

    if corem_id:
        query = "select distinct gre.gre_id, start, stop from main_gre gre join main_cre cre on gre.id = cre.gre_id join main_crepos pos on cre.id = pos.cre_id where cre.id in (select distinct cre_id from main_corem_cres where corem_id = %s order by cre_id) and start >= %s and stop <= %s"
        if omit0:
            query += " and gre.gre_id != '" + orgcode + "_0'"
        #print "QUERY1: ", query
        cur.execute(query, [corem_id, start, stop])
        rows = [(row[0], row[1], row[2]) for row in cur.fetchall()]

    query = "select distinct g.gre_id, start, stop from main_cre c join main_crepos p on c.id = p.cre_id join main_gre g on g.id = c.gre_id where c.id in (select distinct cre_id from main_crepos where start >= %s and stop <= %s and network_id = %s order by cre_id) and start >= %s and stop <= %s"
    if omit0:
        query += " and g.gre_id != '" + orgcode + "_0'"
    #print "QUERY2: ", query
    cur.execute(query, [start, stop, network_id, start, stop])
    all_rows = [(row[0], row[1], row[2]) for row in cur.fetchall()]
    if not corem_id:
        rows = all_rows

    # sum in two separate rows, to allow for handling restricted sets
    gre_counts = {}
    for gre_id, sstart, sstop in rows:
        if gre_id not in gre_counts:
            gre_counts[gre_id] = {}
        count_map = gre_counts[gre_id]
        for i in range(sstart, sstop + 1):
            if i not in count_map:
                count_map[i] = 0
            count_map[i] += 1

    # even in a restricted set, we want to have total counts
    total_counts = {}
    for gre_id, sstart, sstop in all_rows:
        for i in range(sstart, sstop + 1):
            if i not in total_counts:
                total_counts[i] = 0
            total_counts[i] += 1


    if corem_id == None and top != None:
        print "With top list"
        # rank by sum of counts, highest counts first
        ranks = sorted([(sum([count for pos, count in count_map.items()]), gre_id)
                        for gre_id, count_map in gre_counts.items()], reverse=True)[:top]
        toplist = [item[1] for item in ranks]
    else:
        print "Without top list"
        toplist = gre_counts.keys()

    final_gre_counts = {}
    for gre_id in toplist:
        final_gre_counts[gre_id] = sorted(gre_counts[gre_id].items())
        addlist = []
        inlist = final_gre_counts[gre_id]

        # This is a gap-plumber: D3 will interpolate the values between gaps,
        # so this will add extra positions with a 0 count
        for i in range(len(inlist) - 1):
            l = inlist[i][0]
            m = inlist[i + 1][0]
            addlist.append(inlist[i])
            if m - l == 2:  # the length of the gap is exactly 1
                addlist.append((l + 1, 0))
            elif m - l > 2:
                addlist.append((l + 1, 0))
                addlist.append((m - 1, 0))
            if i == len(inlist) - 2: # we are at the end of the list
                addlist.append(inlist[i + 1])
        # if not at the start, plumb in fillers at the start and end
        if addlist[0][0] > start:
            addlist.insert(0, (addlist[0][0] - 1, 0))
        if addlist[-1][0] < stop:
            addlist.append((addlist[-1][0] + 1, 0))

        final_gre_counts[gre_id] = addlist
    total_counts = sorted(total_counts.items())

    return (final_gre_counts, total_counts)
    


class Bicluster(models.Model):
    network = models.ForeignKey(Network)
    bc_id = models.CharField(max_length=255)
    residual = models.DecimalField(max_digits=9, decimal_places=6)  # (max_digits=8,decimal_places=5)
    
    # Many-to-many relationships
    genes = models.ManyToManyField(Gene, verbose_name = "Gene members")
    conditions = models.ManyToManyField(Condition, verbose_name = "Condition members")
    cres = models.ManyToManyField(Cre, verbose_name = "CRE members")
    gres = models.ManyToManyField(Gre, verbose_name = "GRE members")
    corems = models.ManyToManyField("Corem", verbose_name = "Corem")
    
    def expMatrix(self):
        m = [ [ 0 for i in range(len(self.genes)) ] for j in range(len(self.conditions)) ]
        for i in range(len(self.genes)):
            for j in range(len(self.conditions)):
                m[i][j] = float(Row.objects.get(expression__gene=self.genes[i],
                               expresion__condition=self.conditions[j]).value)
        return (self.genes,self.conditions,m)
    
    def __unicode__(self):
        return '%s' % self.bc_id
    


class Corem(models.Model):
    network = models.ForeignKey(Network)
    corem_id = models.CharField(max_length=255)

    #top_bcs = models.ManyToManyField(Bicluster, verbose_name = "top biclusters")
    # need a separate table for this
    #go_enrichment = models.CharField(max_length=128)
    genes = models.ManyToManyField(Gene, verbose_name = "Gene members")
    expression = models.ManyToManyField(Expression, verbose_name = "gene expression")

    # attributed many-to-many
    gres = models.ManyToManyField(Gre, verbose_name="GRE members",
                                  through='GreCoremMembership')
    conditions = models.ManyToManyField(Condition, verbose_name="Condition members",
                                        through='CoremConditionMembership')
    cres = models.ManyToManyField(Cre, verbose_name="Cre members")
    
    def expMatrix(self):
        m = [ [ 0 for i in range(len(self.genes)) ] for j in range(len(self.conditions)) ]
        for i in range(len(self.genes)):
            for j in range(len(self.conditions)):
                m[i][j] = float(Row.objects.get(expression__gene=self.genes[i],
                               expresion__condition=self.conditions[j]).value)
        return (self.genes,self.conditions,m)
    
    def __unicode__(self):
        return '%s' % self.corem_id



class greTF(models.Model):
    network = models.ForeignKey(Network)
    tf = models.CharField(max_length=255)
    gre = models.ForeignKey(Gre, verbose_name = "GRE members")
    score = models.DecimalField(max_digits=18, decimal_places=16)  # models.CharField(max_length=255)
    
    def __unicode__(self):
        return '%s : %s = %s' % (self.gre_id, self.tf, self.score)


######################################################################
####  Many-to-many relationships with attributes
######################################################################

class GreGeneMembership(models.Model):
    gre = models.ForeignKey(Gre, verbose_name = "GRE parent")
    gene = models.ForeignKey(Gene, verbose_name = "gene parent")
    p_val = models.DecimalField(max_digits=15, decimal_places=13) # models.CharField(max_length=128)
    
    def __unicode__(self):
        return '%s : %s : %s' % (self.gre_id,self.gene,self.p_val)
    
    class Meta:
        ordering = ['gre']
        
class GeneConditionMembership(models.Model):
    cond = models.ForeignKey(Condition, verbose_name = "condition parent")
    gene = models.ForeignKey(Gene, verbose_name = "gene parent")
    p_val = models.DecimalField(max_digits=15, decimal_places=13) # models.CharField(max_length=128)
    
    def __unicode__(self):
        return '%s : %s : %s' % (self.cond_id,self.gene,self.p_val)

    class Meta:
        ordering = ['cond']
        
class CoremConditionMembership(models.Model):
    cond = models.ForeignKey(Condition, verbose_name = "condition parent")
    corem = models.ForeignKey('Corem', verbose_name = "corem parent")
    p_val = models.DecimalField(max_digits=15, decimal_places=13)  # models.CharField(max_length=128)
    
    def __unicode__(self):
        return '%s : %s : %s' % (self.cond_id,self.corem,self.p_val)
    
    class Meta:
        ordering = ['cond']
        
class CoremGOMembership(models.Model):
    go = models.ForeignKey(GO, verbose_name = "GO parent")
    tot_annotated = models.IntegerField()
    genes_annotated = models.IntegerField()
    p_val = models.DecimalField(max_digits=15, decimal_places=13)  # models.CharField(max_length=128)
    
    corem = models.ForeignKey('Corem', verbose_name = "corem parent")

    def return_pval(self):
        return float(self.p_val)
    
    def __unicode__(self):
        return '%s : %s : %s' % (self.go,self.corem,self.p_val)

    class Meta:
        ordering = ['go']
        
class GreConditionMembership(models.Model):
    cond = models.ForeignKey(Condition, verbose_name = "condition parent")
    gre = models.ForeignKey('Gre', verbose_name = "gre parent")
    p_val = models.DecimalField(max_digits=15, decimal_places=13)  # models.CharField(max_length=128)

    def __unicode__(self):
        return '%s : %s : %s' % (self.cond_id,self.gre,self.p_val)

    class Meta:
        ordering = ['cond']
        
class GreCoremMembership(models.Model):
    gre = models.ForeignKey(Gre, verbose_name = "GRE parent")
    corem = models.ForeignKey('Corem', verbose_name = "corem parent")
    p_val = models.DecimalField(max_digits=15, decimal_places=13)

    def __unicode__(self):
        return '%s : %s : %s' % (self.gre_id,self.corem,self.p_val)

    class Meta:
        ordering = ['gre']
        
# These are not implemented at the moment. For future use
#class Cog(models.Model):
#    cog_id = models.CharField(max_length=128,required=False)
#    cog_fun = models.CharField(max_length=128,required=False)
#    cog_desc = models.CharField(max_length=128,required=False)
#    
#class Tigr(models.Model):    
#    tigr_fam_id = models.CharField(max_length=128,required=False)
#    tigr_roles = models.CharField(max_length=128,required=False)
#    
#    def __unicode__(self):
#        return self.bc_id
#    
#class Go(models.Model):
#    go_id = models.CharField(max_length=128,required=False)
#    term = models.CharField(max_length=128,required=False)
#    
#    def __unicode__(self):
#        return self.go_id
#    
#class Kegg(models.Model):
#    ec = models.CharField(max_length=128,required=False)
#    ec_desc = models.CharField(max_length=128,required=False)
