import urllib2
import urllib
import simplejson
from django.conf import settings

def make_query_string(q):
    return '+'.join([urllib.quote(comp.encode('utf-8')) for comp in q.split(' ')])

def search(q):
    """We send our query directly to Solr without going through the sunburnt library.
    Sunburnt creates funny query strings which can lead to less than optimal results.
    """
    req = urllib2.Request(settings.SOLR_URL)
    query_string = make_query_string(q)
    print "SEARCHING WITH QUERY: '%s'" % query_string
    print 'wt=json&rows=1000&facet=true&facet.field=network&q=' + query_string
    response = urllib2.urlopen(settings.SOLR_URL,
                               'wt=json&facet=true&facet.field=network&q=' + query_string)
    result = simplejson.loads(response.read())
    resp   = result['response']
    params = result['responseHeader']['params']

    start = resp['start']
    num_found = resp['numFound']
    docs = resp['docs']
    facets = []
    if params['facet'] == 'true':
        facet_field = params['facet.field']
        resp_facets = result['facet_counts']['facet_fields'][facet_field]
        for i in range(0, len(resp_facets), 2):
            facets.append((resp_facets[i], resp_facets[i + 1]))
    return docs, facets
           
