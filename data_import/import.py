#!/usr/bin/python

import sys
import psycopg2
import rsat
import re
import os
import traceback

# This prefix is used in the Postgres database, Django prepends that to the
# model class name. If you named your application differently, this
# is the place to change
APP_PREFIX = 'egrin2_django_'

ECO_PATH = "/home/weiju/Projects/ISB/egrin2_static_data/fixtures/511145/ecoli_"
HAL_PATH = "/home/weiju/Projects/ISB/egrin2_static_data/fixtures/64091/hal_"
BASE_PATH = { 'eco': ECO_PATH, 'hal': HAL_PATH }

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

######################################################################
### Import Microbes Online genome data
######################################################################

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
        cur = conn.cursor()
        infile.readline()  # skip header
        for line in infile.readlines():
            row = line.strip("\n").split("\t")
            if len(row[7]) > 0:
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
               if feature[0] in feature_map.keys() and feature_map[feature[0]] not in genes]

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
                print "%d percent done" % ((float(count)/tot)*100)
            row = line.strip("\n").split("\t")
            cond_id = "%s_%s" % (organism, row[1])
            cur.execute(query, [gene_map[row[0]], conditions_map[cond_id], row[2]])

        conn.commit()
        cur.close()
            
######################################################################
### Import GRE
######################################################################

def add_gre(organism, conn):
    pssm_query = "insert into " + APP_PREFIX + "pssm (parent_id) values (%s) returning id"
    row_query = "insert into " + APP_PREFIX + "row (pssm_id,pos,a,c,g,t) values (%s,%s,%s,%s,%s,%s)"
    gre_query = "insert into " + APP_PREFIX + "gre (network_id,gre_id,pssm_id,p_val) values (%s,%s,%s,'')"
    print "Importing GRE for ", organism
    with open(BASE_PATH[organism] + "gre.txt") as infile:
        cur = conn.cursor()
        infile.readline()
        try:
            for line in infile.readlines():
                row = line.strip("\n").split("\t")
                parent_id = "%s_%s" % (organism, row[0])
                cur.execute(pssm_query, [parent_id])
                pssm_id = cur.fetchone()[0]
                pssm = row[1].split(":")
                for pssm_row in pssm:
                    pssm_cols = pssm_row.split(",")
                    cur.execute(row_query, [pssm_id, pssm_cols[0],
                                            pssm_cols[1], pssm_cols[2], pssm_cols[3],
                                            pssm_cols[4]])
                gre_id = "%s_%s" % (organism, pssm_cols[0])
                cur.execute(gre_query, [NETWORK[organism], gre_id, pssm_id])
            conn.commit()
        except:
            traceback.print_exc(file=sys.stdout)
            conn.rollback()
        cur.close()


if __name__ == '__main__':
    print "EGRIN2 data import"
    conn = psycopg2.connect("dbname=egrin2 user=dj_ango")
    for organism in ['eco', 'hal']:
        print "organism: ", organism
        #add_microbes_online_genes(organism, conn)
        #add_rsat_genes(organism, conn)
        #add_conditions(organism, conn)
        #add_gene_expressions(organism, conn)
        add_gre(organism, conn)
    conn.close()
