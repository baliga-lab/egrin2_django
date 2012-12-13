#!/usr/bin/python

import sys
import psycopg2
import rsat
import re
import os
import traceback
from decimal import Decimal

# This prefix is used in the Postgres database, Django prepends that to the
# model class name. If you named your application differently, this
# is the place to change
APP_PREFIX = 'egrin2_django_'

PARENT_PATH = "/isb-1/tmp/fixtures/"
ECO_PATH = "/isb-1/tmp/fixtures/511145/ecoli_"
HAL_PATH = "/isb-1/tmp/fixtures/64091/hal_"
BASE_PATH = { 'eco': ECO_PATH, 'hal': HAL_PATH, 'parent': PARENT_PATH }

# these maps reflect the ids established in the base fixtures
SPECIES = { 'eco': 1, 'hal': 2 }
DEFAULT_CHROMOSOME = { 'eco': 1, 'hal': 2 }
CHROMOSOME = { 'eco': { 'chromosome': 1 },
               'hal': { 'chr': 2, 'pNRC100': 3, 'pNRC200': 4 } }
CHR_MO = { 7023: 1, 69: 2, 48: 3, 70: 4 }
CHR_RSAT = { "NC_000913.2": 1,
             "NC_002607.1": 2, "NC_001869.1": 3, "NC_002608.1": 4 }
NETWORK = { 'eco': 1, 'hal': 2 }

RSAT_BASE_URL = 'http://rsat.ccb.sickkids.ca'
RSAT_NAME = { 'eco': 'Escherichia_coli_K12', 'hal': 'Halobacterium_sp'}
RSAT_GENE_PATTERN = { 'eco': re.compile(r'^b[0-9]+'), 'hal': re.compile(r'^VNG[0-9]+[CGH]$') }

PSSM_QUERY = "insert into " + APP_PREFIX + "pssm (parent_id) values (%s) returning id"
ROW_QUERY = "insert into " + APP_PREFIX + "row (pssm_id,pos,a,c,g,t) values (%s,%s,%s,%s,%s,%s)"

# different prefixing scheme for corems, we need to adjust this for more organisms
COREM_PREFIX = { 'eco': 'ec', 'hal': 'hc' }

def to_decimal(strval):
    if strval == None or strval == '' or strval == 'NA':
        return Decimal('NaN')
    else:
        return Decimal(strval)
    
def to_int(strval):
    if strval == None or strval == '' or strval == 'NA':
        return int("0")
    else:
        return int(strval)

def get_gene_map(conn, organism):
    cur = conn.cursor()
    query = "select id, sys_name from " + APP_PREFIX + "gene where species_id = %s"
    cur.execute(query, [SPECIES[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_conditions_map(conn, organism):
    cur = conn.cursor()
    query = "select id, cond_id from " + APP_PREFIX + "condition where network_id = %s"
    cur.execute(query, [NETWORK[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_gre_map(conn, organism):
    cur = conn.cursor()
    query = "select id, gre_id from " + APP_PREFIX + "gre where network_id = %s"
    cur.execute(query, [NETWORK[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_cre_map(conn, organism):
    cur = conn.cursor()
    query = "select id, cre_id from " + APP_PREFIX + "cre where network_id = %s"
    cur.execute(query, [NETWORK[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_bicluster_map(conn, organism):
    cur = conn.cursor()
    query = "select id, bc_id from " + APP_PREFIX + "bicluster where network_id = %s"
    cur.execute(query, [NETWORK[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_corem_map(conn, organism):
    cur = conn.cursor()
    query = "select id, corem_id from " + APP_PREFIX + "corem where network_id = %s"
    cur.execute(query, [NETWORK[organism]])
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

def get_go_map(conn):
    cur = conn.cursor()
    query = "select id, go_id from " + APP_PREFIX + "go"
    cur.execute(query)
    result = { row[1]: row[0] for row in cur.fetchall() }
    cur.close()
    return result

######################################################################
### Import Gene Ontology Table
######################################################################

def insert_go(cur, go_id, ontology, term, definition, synonym):
    query = "insert into " + APP_PREFIX + "go (go_id, ontology, term, definition, synonym) values (%s,%s,%s,%s,%s)"
    cur.execute(query, [go_id, ontology, term, definition, synonym])
    
def add_go(conn):
    print "Importing Gene Ontology Reference Table..."
    with open(BASE_PATH['parent'] + "geneontology.txt") as infile:
        cur = conn.cursor()
        infile.readline()  # skip header
        for line in infile.readlines():
            row = line.strip("\n").split("\t")
            go_id = row[0]
            ontology = row[3]
            term = row[2]
            definition = row[4]
            synonym = row[5]
            insert_go(cur, go_id, ontology, term, definition, synonym)
        conn.commit()
        cur.close()
    print "done"    

######################################################################
### Import Microbes Online genome data
######################################################################

def make_gene_description(desc):
    return desc.rstrip("(NCBI)").rstrip("(VIMSS").rstrip("(RefSeq").rstrip("(NCBI ptt fil")

def insert_gene(cur, species, accession, gi, start, stop, strand, sys_name, name, desc,
                chromosome_id):
    query = "insert into " + APP_PREFIX + "gene (species_id, accession, gi, start, stop, strand, sys_name, name, description, chromosome_id) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    cur.execute(query, [species, accession, gi, start, stop,
                        strand, sys_name, name, desc, chromosome_id])

def add_microbes_online_genes(organism, conn):
    print "Importing Microbes Online Genes..."
    with open(BASE_PATH[organism] + "genes.txt") as infile:
        with open(BASE_PATH[organism] + "genes_in_model.txt") as refile:
            ref = refile.readline().strip("\n").split(",")
            cur = conn.cursor()
            infile.readline()  # skip header
            for line in infile.readlines():
                row = line.strip("\n").split("\t")
                if len(row[7]) > 0:
                    if row[7] in ref:
                        species = int(SPECIES[organism])
                        accession = row[1]
                        gi = row[2]
                        chromosome_id = CHR_MO[int(row[3])]
                        start = int(row[4])
                        stop = int(row[5])
                        strand = row[6]
                        sys_name = row[7]
                        name = row[8]
                        desc = make_gene_description(row[9])
                        insert_gene(cur, species, accession, gi, start, stop,
                                    strand, sys_name, name, desc, chromosome_id)
                        conn.commit()
            cur.close()
    print "done"

######################################################################
### Import RSAT genome data
######################################################################

def all_gene_names(conn, organism):
    query = 'select sys_name from ' + APP_PREFIX + 'gene where species_id = %s'
    cur = conn.cursor()
    cur.execute(query, [SPECIES[organism]])
    genes = [row[0] for row in cur.fetchall()]
    cur.close()
    return genes

def add_rsat_genes(organism, conn):
    print "Reading RSAT genes for ", organism
    if not os.path.exists('cache'):
        os.mkdir('cache')
    rsatdb = rsat.RSATDatabase(RSAT_BASE_URL, 'cache')
    rsat_name = RSAT_NAME[organism]
    
    with open(BASE_PATH[organism] + "genes_in_model.txt") as refile:
        ref = refile.readline().strip("\n").split(",")

    features = [line.split('\t')
                for line in rsatdb.get_features(rsat_name).split("\n")
                if not line.startswith('--') and len(line.split('\t')) == 11]
    feature_names = [line.split('\t')
                     for line in rsatdb.get_feature_names(rsat_name).split("\n")
                     if not line.startswith("--") and len(line.split('\t')) == 3]

    feature_map = { row[0]: row[1] for row in feature_names
                    if RSAT_GENE_PATTERN[organism].match(row[1]) }

    genes = all_gene_names(conn, organism)

    missing = [feature for feature in features
               if feature[0] in feature_map.keys() and feature_map[feature[0]] not in genes and feature_map[feature[0]] in ref]

    cur = conn.cursor()
    print "added %d missing features from RSAT." % len(missing)
    for feature in missing:
        strand = '+'
        if feature[6] == 'R':
            strand = '-'
        chrom = CHR_RSAT[feature[3]]
        insert_gene(cur, SPECIES[organism], feature[0], feature[10],
                    int(feature[4]), int(feature[5]), strand,
                    feature_map[feature[0]], feature[2],
                    make_gene_description(feature[7]), CHR_RSAT[feature[3]])
    conn.commit()
    cur.close()

######################################################################
### Import conditions
######################################################################

def add_conditions(organism, conn):
    query = "insert into " + APP_PREFIX + "condition (network_id, cond_id, cond_name) values (%s,%s,%s)"
    print "Importing conditions for ", organism
    with open(BASE_PATH[organism] + "conditions.txt") as infile:
        cur = conn.cursor()
        infile.readline()  # ignore header
        for line in infile.readlines():
            row = line.strip("\n").split("\t")
            cond_id = "%s_%s" % (organism, row[0])
            cur.execute(query, [NETWORK[organism], cond_id, row[1]])
        conn.commit()
        cur.close()

######################################################################
### Import gene expressions
######################################################################

def add_gene_expressions(organism, conn, check_missing=False):
    print "Importing gene expressions for ", organism
    query = "insert into " + APP_PREFIX + "expression (gene_id, condition_id, value) values (%s,%s,%s)"
    with open(BASE_PATH[organism] + "exp.txt") as infile:
        genes = all_gene_names(conn, organism)
        infile.readline()  # ignore header
        lines = infile.readlines()
        count = 0
        tot = len(lines)
        if check_missing:
            print "calculate sys names..."
            sys_names = [line.split('\t')[0] for line in lines]
            print "done..."
            print "determine missing genes in gene expressions..."
            missing = set()
            for sys_name in sys_names:
                if sys_name not in missing and sys_name not in genes:
                    missing.add(sys_name)
            print "done..."
            print "insert missing dummy genes.."
            cur = conn.cursor()
            for sys_name in missing:
                insert_gene(cur, SPECIES[organism], '', '', 0, 0, '+', sys_name, '', '',
                            DEFAULT_CHROMOSOME[organism])
            conn.commit()
            cur.close()
            print "done..."

        gene_map = get_gene_map(conn, organism)
        conditions_map = get_conditions_map(conn, organism)
        cur = conn.cursor()
        for line in lines:
            count += 1
            if count % 100000 == 0:
                print "%d %% done" % ((float(count)/tot)*100)
            row = line.strip("\n").split("\t")
            cond_id = "%s_%s" % (organism, row[1])
            cur.execute(query, [gene_map[row[0]], conditions_map[cond_id],
                                to_decimal(row[2])])

        conn.commit()
        cur.close()
            
######################################################################
### Import GRE
######################################################################

def add_gre(organism, conn):
    gre_query = "insert into " + APP_PREFIX + "gre (network_id,gre_id,pssm_id,is_pal,pal_pval,p_val) values (%s,%s,%s,%s,%s,'NaN')"
    print "Importing GRE for ", organism
    with open(BASE_PATH[organism] + "gre.txt") as infile:
        cur = conn.cursor()
        infile.readline()
        try:
            for line in infile.readlines():
                row = line.strip("\n").split("\t")
                parent_id = "%s_%s" % (organism, row[0])
                cur.execute(PSSM_QUERY, [parent_id])
                pssm_id = cur.fetchone()[0]
                pssm = row[3].split(":")
                for pssm_row in pssm:
                    pssm_cols = pssm_row.split(",")
                    cur.execute(ROW_QUERY, [pssm_id, pssm_cols[0],
                                            pssm_cols[1], pssm_cols[2], pssm_cols[3],
                                            pssm_cols[4]])
                gre_id = "%s_%s" % (organism, row[0])
                cur.execute(gre_query, [NETWORK[organism], gre_id, pssm_id,row[1],row[2]])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()

######################################################################
### Import CRE
######################################################################

def add_cre(organism, conn):
    cre_query = "insert into " + APP_PREFIX + "cre (network_id,cre_id,gre_id,pssm_id,e_val) values (%s,%s,%s,%s,%s)"
    print "Importing CRE for ", organism
    with open(BASE_PATH[organism] + "cre.txt") as infile:
        gre_map = get_gre_map(conn, organism)
        cur = conn.cursor()
        infile.readline()
        try:
            for line in infile.readlines():
                row = line.strip("\n").split("\t")
                parent_id = "%s_%s" % (organism, row[0])
                cur.execute(PSSM_QUERY, [parent_id])
                pssm_id = cur.fetchone()[0]
                pssm = row[3].split(":")
                for pssm_row in pssm:
                    pssm_cols = pssm_row.split(",")
                    cur.execute(ROW_QUERY, [pssm_id, pssm_cols[0],
                                            to_decimal(pssm_cols[1]),
                                            to_decimal(pssm_cols[2]),
                                            to_decimal(pssm_cols[3]),
                                            to_decimal(pssm_cols[4])])
                cre_id = "%s_%s" % (organism, row[0])
                gre_id = "%s_%s" % (organism, row[1])
                cur.execute(cre_query, [NETWORK[organism], cre_id, gre_map[gre_id],
                                        pssm_id, to_decimal(row[2])])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()

######################################################################
### Import Biclusters
######################################################################

def add_biclusters(organism, conn):
    bicluster_query = "insert into " + APP_PREFIX + "bicluster (network_id,bc_id,residual) values (%s,%s,%s) returning id"
    bicluster_gene_query = "insert into " + APP_PREFIX + "bicluster_genes (bicluster_id,gene_id) values (%s,%s)"
    bicluster_cond_query = "insert into " + APP_PREFIX + "bicluster_conditions (bicluster_id,condition_id) values (%s,%s)"
    bicluster_cre_query = "insert into " + APP_PREFIX + "bicluster_cres (bicluster_id,cre_id) values (%s,%s)"
    bicluster_gre_query = "insert into " + APP_PREFIX + "bicluster_gres (bicluster_id,gre_id) values (%s,%s)"

    print "Importing biclusters for ", organism

    with open(BASE_PATH[organism] + "biclusters.txt") as infile:
        gene_map = get_gene_map(conn, organism)
        cond_map = get_conditions_map(conn, organism)
        gre_map = get_gre_map(conn, organism)
        cre_map = get_cre_map(conn, organism)
        
        cur = conn.cursor()
        try:
            infile.readline()  # skip header
            lines = infile.readlines()
            tot = len(lines)
            count = 0
            for line in lines:
                count += 1
                #print count
                if count % 1000 == 0:
                    print "%d %% done" % ( (float(count) / tot) * 100.0)
                row = line.strip('\n').split('\t')
                bc_id = "%s_%s" % (organism, row[0])
                gene_ids = set([gene_map[sys_name] for sys_name in row[2].split(",") if sys_name != ''])
                condition_ids = set([cond_map[cond_id]
                                     for cond_id in ['%s_%s' % (organism, cond) for cond in  row[3].split(",")]])
                cre_ids = set([cre_map[cre_id]
                               for cre_id in ['%s_%s' % (organism, cre) for cre in row[4].split(",")]])
                gre_ids = set([gre_map[gre_id]
                               for gre_id in ['%s_%s' % (organism, gre) for gre in row[5].split(",") if gre != 'NULL'] 
                               if gre_id != organism + '_' and gre_id !=''])

                # create bicluster record
                cur.execute(bicluster_query, [NETWORK[organism], bc_id, to_decimal(row[1])])
                bicluster_id = cur.fetchone()[0]
                # establish membership associations
                for gene_id in gene_ids:
                    cur.execute(bicluster_gene_query, [bicluster_id, gene_id])
                for condition_id in condition_ids:
                    cur.execute(bicluster_cond_query, [bicluster_id, condition_id])
                for cre_id in cre_ids:
                    cur.execute(bicluster_cre_query, [bicluster_id, cre_id])
                for gre_id in gre_ids:
                    cur.execute(bicluster_gre_query, [bicluster_id, gre_id])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()

        cur.close()

######################################################################
### Import Corems
######################################################################
def get_bicluster_ids(conn, biclusters):
    if len(biclusters) == 0:
        return []
    query = "select id from " + APP_PREFIX + "bicluster where bc_id in (" + ','.join(["'%s'" % bicluster for bicluster in biclusters]) + ')'
    cur = conn.cursor()
    cur.execute(query)
    ids = [row[0] for row in cur.fetchall()]
    cur.close()
    return ids

def add_corems(organism, conn):
    corem_query = "insert into " + APP_PREFIX + "corem (network_id,corem_id) values (%s,%s) returning id"
    corem_gene_query = "insert into " + APP_PREFIX + "corem_genes (corem_id,gene_id) values (%s,%s)"
    bicl_corem_query = "insert into " + APP_PREFIX + "bicluster_corems (bicluster_id,corem_id) values (%s,%s)"
    corem_gre_query = "insert into " + APP_PREFIX + "grecoremmembership (gre_id,corem_id,p_val) values (%s,%s,%s)"
    corem_go_query = "insert into " + APP_PREFIX + "coremgomembership (go_id,tot_annotated,genes_annotated,p_val,corem_id) values (%s,%s,%s,%s,%s)"

    print "Importing corems for ", organism
    with open(BASE_PATH[organism] + "corems.txt") as infile:
        gene_map = get_gene_map(conn, organism)
        gre_map = get_gre_map(conn, organism)
        bicluster_map = get_bicluster_map(conn, organism)
        go_map = get_go_map(conn)

        cur = conn.cursor()
        infile.readline()  # skip header
        try:
            count = 1
            for line in infile.readlines():
                print count
                count = count + 1
                row = line.strip("\n").split("\t")
                # note that the naming scheme for corems is different
                corem_id_str = '%s%s' % (COREM_PREFIX[organism], row[0])
                cur.execute(corem_query, [NETWORK[organism], corem_id_str])
                corem_id = cur.fetchone()[0]
                gene_ids = set([gene_map[sys_name] for sys_name in row[1].split(",")])
                for gene_id in gene_ids:
                    cur.execute(corem_gene_query, [corem_id, gene_id])

                biclusters = set(['%s_%s' % (organism, bicl) for bicl in row[2].split(',')])
                #bicluster_ids = get_bicluster_ids(conn, biclusters)
                bicluster_ids = [bicluster_map[bicluster] for bicluster in biclusters]
                for bicluster_id in bicluster_ids:
                    cur.execute(bicl_corem_query, [bicluster_id, corem_id])

                gre_ids = [gre_map[gre_name]
                           for gre_name in ['%s_%s' % (organism, gre) for gre in row[3].split(",") if len(row[3]) > 0 and gre != 'NA']]
                pvals = [pval for pval in row[4].split(',') if len(row[4]) > 0]
                for index in xrange(len(gre_ids)):
                    if index < len(pvals):
                        pval = pvals[index]
                    else:
                        pval = '0.0'
                    cur.execute(corem_gre_query, [gre_ids[index], corem_id, to_decimal(pval)])
                    
                go_ids = [go_map[go_id]
                           for go_id in row[5].split(",") if len(row[5]) > 0]
                tot_annot = [tot_ann for tot_ann in row[6].split(",") if len(row[6]) > 0]
                genes_annot = [gene_ann for gene_ann in row[7].split(",") if len(row[7]) > 0]
                pvals = [pval for pval in row[8].split(',') if len(row[8]) > 0]
                for index in xrange(len(go_ids)):
                    if index < len(pvals):
                        pval = pvals[index]
                    else:
                        tot_annot = '0'
                        genes_annot = '0'
                        pval = '0.0'
                    cur.execute(corem_go_query, [go_ids[index], to_int(tot_annot[index]), to_int(genes_annot[index]),
                                                 to_decimal(pval),corem_id])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()

######################################################################
### Conditions, second pass
######################################################################

def augment_conditions(organism, conn, check_biclusters=False,
                       connect_corems=True, connect_genes=False, connect_gres=False):
    """establish condition-bicluster and condition-corem relationship"""
    corem_condition_query = "insert into " + APP_PREFIX + "coremconditionmembership (corem_id,cond_id,p_val) values (%s,%s,%s)"
    gene_condition_query = "insert into " + APP_PREFIX + "geneconditionmembership (cond_id,gene_id,p_val) values (%s,%s,%s)"
    gre_condition_query = "insert into " + APP_PREFIX + "greconditionmembership (cond_id,gre_id,p_val) values (%s,%s,%s)"

    print "augmenting condition information for ", organism
    with open(BASE_PATH[organism] + "conditions.txt") as infile:
        infile.readline()
        lines = infile.readlines()
        tot = len(lines)
        counter = 0
        cond_map = get_conditions_map(conn, organism)
        gene_map = get_gene_map(conn, organism)
        gre_map = get_gre_map(conn, organism)

        if check_biclusters:
            bicluster_map = get_bicluster_map(conn, organism)
        if connect_corems:
            corem_map = get_corem_map(conn, organism)

        cur = conn.cursor()
        try:
            for line in lines:
                counter += 1
                if counter % 100 == 0:
                    print "%d %% done" % ((float(counter) / tot) * 100)
                row = line.strip("\n").split("\t")
                # get condition
                condition_id = cond_map['%s_%s' % (organism, row[0])]

                # just as a consistency check, we should have those relationship recorded and checking
                # takes a long time, so it's optional
                if check_biclusters:
                    biclusters = ['%s_%s' % (organism, bicluster) for bicluster in row[2].split(',') if len(row[2]) > 0]
                    # bicluster_ids = get_bicluster_ids(conn, biclusters)
                    bicluster_ids = [bicluster_map[bicluster] for bicluster in biclusters]
                    #print "bicluster_ids: ", bicluster_ids
                    for bicluster_id in bicluster_ids:
                        cur.execute('select count(*) from ' + APP_PREFIX + 'bicluster_conditions where bicluster_id = %s and condition_id = %s',
                                    [bicluster_id, condition_id])
                        num = cur.fetchone()[0]
                        if num == 0:
                            print "missing condition-bicluster relation, condition: %d and bicluster: %d" % (condition_id, bicluster_id)

                if connect_corems:
                    corems = ['%s%s' % (COREM_PREFIX[organism], corem) for corem in row[3].split(',')
                              if len(row[3]) > 0]
                    pvals = [pval for pval in row[4].split(',') if len(row[4]) > 0]
                    corem_ids = [corem_map[corem] for corem in corems]
                    for index in xrange(len(corem_ids)):
                        cur.execute(corem_condition_query, [corem_ids[index],
                                                            condition_id,
                                                            to_decimal(pvals[index])])

                if connect_genes:
                    gene_ids = [gene_map[gene] for gene in row[5].split(',') if len(row[5]) > 0]
                    pvals = [pval for pval in row[6].split(',') if len(row[6]) > 0]
                    for index in xrange(len(gene_ids)):
                        cur.execute(gene_condition_query, [condition_id, gene_ids[index],
                                                           to_decimal(pvals[index])])

                if connect_gres:
                    if len(row[7]) > 0:
                        gre_ids = [gre_map[gre]
                                   for gre in ['%s_%s' % (organism,gre_name)
                                               for gre_name in row[7].split(',')]]
                    else:
                        gre_ids = []
                    pvals = [pval for pval in row[8].split(',') if len(row[8]) > 0]
                    for index in xrange(len(gre_ids)):
                        cur.execute(gre_condition_query, [condition_id, gre_ids[index],
                                                          to_decimal(pvals[index])])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()

        cur.close()

######################################################################
### Genes, second pass
######################################################################
def augment_genes(organism, conn):
    """establish gene relationships"""
    gre_gene_query = "insert into " + APP_PREFIX + "gregenemembership (gre_id,gene_id,p_val) values (%s,%s,%s)"
    print "augmenting gene information for ", organism
    with open(BASE_PATH[organism] + "genes_2.txt") as infile:
        gene_map = get_gene_map(conn, organism)
        gre_map = get_gre_map(conn, organism)

        infile.readline()
        lines = infile.readlines()
        tot = len(lines)
        counter = 0
        cur = conn.cursor()

        try:
            for line in lines:
                counter += 1
                if counter % 1000 == 0:
                    print "%d %% done" % ((float(counter) / tot) * 100)

                # gene, gre_id, pval
                row = line.strip("\n").split("\t")
                gene_id = gene_map[row[0]]
                gre_ids = [gre_map[gre]
                           for gre in ['%s_%s' % (organism, gre)
                                       for gre in row[1].split(',') if len(gre) > 0]]
                pvals = [pval for pval in row[2].split(',') if len(pval) > 0]
                for index in range(len(gre_ids)):
                    cur.execute(gre_gene_query, [gre_ids[index], gene_id, to_decimal(pvals[index])])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()

######################################################################
### add eco GRE-->regulator matches
######################################################################
def add_gre_regulator(organism, conn):
    gre_tf_query = "insert into " + APP_PREFIX + "gretf (network_id,tf,gre_id,score) values (%s,%s,%s,%s)"
    print "augmenting gre regulator information for ", organism
    with open(BASE_PATH[organism] + "gre_matches.txt") as infile:
        gre_map = get_gre_map(conn, organism)
        infile.readline()  # skip header
        lines = infile.readlines()
        tot = len(lines)
        counter = 0
        cur = conn.cursor()
        try:
            for line in lines:
                counter += 1
                if counter % 1000 == 0:
                    print "%d %% done" % ((float(counter) / tot) * 100)

                # gene, gre_id, pval
                row = line.strip("\n").split("\t")
                gre_id = gre_map['%s_%s' % (organism, row[0])]
                regulators = [regulator for regulator in row[1].split(",") if len(regulator) > 0]
                scores = [to_decimal(score) for score in row[2].split(',') if len(score) > 0]
                for index in xrange(len(regulators)):
                    cur.execute(gre_tf_query, [NETWORK[organism], regulators[index],
                                               gre_id, scores[index]])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()

if __name__ == '__main__':
    print "EGRIN2 data import"
    conn = psycopg2.connect("dbname=egrin2 user=dj_ango")
#    add_go(conn)
    for organism in ['eco']:#,'hal']:
        print "organism: ", organism
#        add_microbes_online_genes(organism, conn)
#        add_rsat_genes(organism, conn)
#        add_conditions(organism, conn)
#        add_gene_expressions(organism, conn, check_missing=True)
#        add_gre(organism, conn)
#        add_cre(organism, conn)
#        add_biclusters(organism, conn)
        add_corems(organism, conn)
#        augment_conditions(organism, conn, check_biclusters=False,
#                           connect_corems=True, connect_genes=True,
#                           connect_gres=True)
#        augment_genes(organism, conn)
#        if organism == 'eco':
#            add_gre_regulator(organism, conn)

    conn.close()
