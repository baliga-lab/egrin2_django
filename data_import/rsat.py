# vi: sw=4 ts=4 et:
"""organism.py - organism-specific functionality in cMonkey

This file is part of cMonkey Python. Please see README and LICENSE for
more information and licensing details.
"""
import logging
import urllib
import os

class RSATURLopener(urllib.FancyURLopener):
    """An URL opener that can detect 404 errors"""

    def http_error_default(self, url, fp, errcode, errmsg, headers):
        # pylint: disable-msg=R0913
        # pylint: disable-msg=C0103
        """overriding the default error handling method to handle HTTP 404
        errors"""
        if (errcode == 404):
            raise DocumentNotFound(url)

        # call super class handler.
        # note that urllib.FancyURLopener is not a new-style class
        return urllib.FancyURLopener.http_error_default(
            self, url, fp, errcode, errmsg, headers)


def read_url(url):
    """convenience method to read a document from a URL using the
    RSATURLopener"""
    return RSATURLopener().open(url).read()


def read_url_cached(url, cache_filename):
    """convenience method to read a document from a URL using the
    RSATURLopener, cached version"""
    if not os.path.exists(cache_filename):
        RSATURLopener().retrieve(url, cache_filename)
    with open(cache_filename) as cached_file:
        return cached_file.read()

class RSATDatabase:
    """abstract interface to access an RSAT mirror"""
    DIR_PATH = 'data/genomes'
    ORGANISM_PATH = 'genome/organism.tab'
    ORGANISM_NAMES_PATH = 'genome/organism_names.tab'
    FEATURE_PATH = 'genome/feature.tab'
    FEATURE_NAMES_PATH = 'genome/feature_names.tab'

    def __init__(self, base_url, cache_dir):
        """create an RSATDatabase instance based on a mirror URL"""
        self.base_url = base_url
        self.cache_dir = cache_dir.rstrip('/')

    def get_directory(self):
        """returns the HTML page for the directory listing"""
        logging.info('RSAT - get_directory()')
        cache_file = "/".join([self.cache_dir, 'rsat_dir.html'])
        return read_url_cached("/".join([self.base_url,
                                              RSATDatabase.DIR_PATH]),
                                    cache_file)

    def get_organism(self, organism):
        """returns the file contents for the specified organism"""
        logging.info('RSAT - get_organism(%s)', organism)
        cache_file = "/".join([self.cache_dir, 'rsat_' + organism])
        return read_url_cached(
            "/".join([self.base_url, RSATDatabase.DIR_PATH, organism,
                      RSATDatabase.ORGANISM_PATH]), cache_file)

    def get_organism_names(self, organism):
        """returns the specified organism name file contents"""
        logging.info('RSAT - get_organism_names(%s)', organism)
        cache_file = "/".join([self.cache_dir, 'rsatnames_' + organism])
        return read_url_cached(
            "/".join([self.base_url, RSATDatabase.DIR_PATH, organism,
                      RSATDatabase.ORGANISM_NAMES_PATH]), cache_file)

    def get_ensembl_organism_names(self, organism):
        """returns the specified organism name file contents, using
        the EnsEMBL path"""
        logging.info('RSAT - get_ensembl_organism_names(%s)', organism)
        return read_url("/".join([self.base_url, RSATDatabase.DIR_PATH,
                                  organism + '_EnsEMBL',
                                  RSATDatabase.ORGANISM_NAMES_PATH]))

    def get_features(self, organism):
        """returns the specified organism's feature file contents
        Note: the current version only tries to read from feature.tab
        while the original cMonkey will fall back to cds.tab
        if that fails
        """
        #logging.info('RSAT - get_features(%s)', organism)
        cache_file = "/".join([self.cache_dir, organism + '_features'])
        return read_url_cached("/".join([self.base_url,
                                              RSATDatabase.DIR_PATH,
                                              organism,
                                              RSATDatabase.FEATURE_PATH]),
                               cache_file)

    def get_feature_names(self, organism):
        """returns the specified organism's feature name file contents"""
        #logging.info('RSAT - get_feature_names(%s)', organism)
        cache_file = "/".join([self.cache_dir, organism + '_feature_names'])
        return read_url_cached(
            "/".join([self.base_url,
                      RSATDatabase.DIR_PATH,
                      organism,
                      RSATDatabase.FEATURE_NAMES_PATH]),
            cache_file)

    def get_contig_sequence(self, organism, contig):
        """returns the specified contig sequence"""
        #logging.info('RSAT - get_contig_sequence(%s, %s)',
        #             organism, contig)
        cache_file = "/".join([self.cache_dir, organism + '_' + contig])
        url = "/".join([self.base_url, RSATDatabase.DIR_PATH, organism,
                        'genome', contig + '.raw'])
        return read_url_cached(url, cache_file).upper()
