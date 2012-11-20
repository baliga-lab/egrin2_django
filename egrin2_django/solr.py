import urllib2
import urllib
from django.utils import simplejson
from egrin2_django.settings import SOLR_URL

def make_query_string(q):
    return '+'.join([urllib.quote(comp.encode('utf-8')) for comp in q.split(' ')])

def search(q):
    """We send our query directly to Solr without going through the sunburnt library.
    Sunburnt creates funny query strings which can lead to less than optimal results.
    """
    req = urllib2.Request(SOLR_URL)
    query_string = make_query_string(q)
    print "SEARCHING WITH QUERY: '%s'" % query_string
    response = urllib2.urlopen(SOLR_URL, 'wt=json&rows=1000&q=' + query_string)
    resp = simplejson.loads(response.read())['response']
    start = resp['start']
    num_found = resp['numFound']
    docs = resp['docs']
    return docs
