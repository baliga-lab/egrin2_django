from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('egrin2_django.views',
    # Examples:
    # url(r'^$', 'egrin2_django.views.home', name='home'),
    # url(r'^egrin2_django/', include('egrin2_django.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'index'),
    url(r'^index/$', 'index', name='index'),
    url(r'^about/$', 'about',name='about'),

    url(r'^browse/$', 'browse',name='browse'),

    ##############################################################################
    # CONDITIONS
    ##############################################################################
    url(r'^conditions/$', 'conditions',name='conditions'),
    url(r'^conditions/(?P<species>[^/]*)/?$', 'conditions',name='conditions'),
    url(r'^conditions/(?P<species>[^/]*)/(?P<condition>[^/]*)/?$', 'condition_detail',name='condition_detail'),

    # filling condition tables with JSON data
    url(r'^conditions_json/$', 'conditions_json',name='conditions_json'),
    url(r'^conditions_json/(?P<species>[^/]*)/?$', 'conditions_json', name='conditions_json'),

    url(r'^corem_conditions_json/$', 'corem_conditions_json',name='corem_conditions_json'),
    url(r'^corem_conditions_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_conditions_json', name='corem_conditions_json'),

    ##############################################################################
    # BICLUSTERS
    ##############################################################################
    url(r'^biclusters_json/$', 'biclusters_json', name='biclusters_json'),
    url(r'^biclusters_json/(?P<species>[^/]*)/?$', 'biclusters_json', name='biclusters_json'),

    url(r'^corem_biclusters_json/$', 'corem_biclusters_json', name='corem_biclusters_json'),
    url(r'^corem_biclusters_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_biclusters_json', name='corem_biclusters_json'),

    url(r'^biclusters/$', 'biclusters',name='biclusters'),
    url(r'^biclusters/(?P<species>[^/]*)/?$', 'biclusters_s',name='biclusters_s'),
    url(r'^biclusters/(?P<species>[^/]*)/(?P<bicluster>[^/]*)/?$', 'bicluster_detail',name='bicluster_detail'),

    ##############################################################################
    # COREMS
    ##############################################################################

    url(r'^corems/$', 'corems',name='corems'),
    url(r'^corems/(?P<species>[^/]*)/?$', 'corems',name='corems'),
    url(r'^corems/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$', 'corem_detail',name='corem_detail'),

    # filling corem tables with JSON data
    url(r'^corems_json/$', 'corems_json',name='corems_json'),
    url(r'^corems_json/(?P<species>[^/]*)/?$', 'corems_json', name='corems_json'),

    ##############################################################################
    # GENES
    ##############################################################################

    url(r'^genes/$', 'genes',name='genes'),
    url(r'^genes/(?P<species>[^/]*)/?$', 'genes',name='genes'),
    url(r'^genes/(?P<species>[^/]*)/(?P<gene>[^/]*)/?$', 'gene_detail',name='gene_detail'),
    
    # filling genes tables with JSON data
    url(r'^genes_json/$', 'genes_json',name='genes_json'),
    url(r'^genes_json/(?P<species>[^/]*)/?$', 'genes_json', name='genes_json'),

    # list of corem-specific genes
    url(r'^corem_genes_json/$', 'corem_genes_json',name='corem_genes_json'),
    url(r'^corem_genes_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_genes_json', name='corem_genes_json'),

    ##############################################################################
    # OTHER
    ##############################################################################

    url(r'^gres/$', 'gres',name='gres'),
    url(r'^gres/(?P<species>[^/]*)/?$', 'gres_s',name='gres_s'),
    url(r'^gres/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$', 'gre_detail',name='gre_detail'),

    url(r'^networks/$', 'networks',name='networks'),
    url(r'^networks/(?P<species>[^/]*)/?$', 'networks',name='networks'),

    url(r'^regulators/(?P<species>[^/]*)/?$', 'regulators',name='regulators'),
    url(r'^regulators/(?P<species>[^/]*)/(?P<regulator>[^/]*)/?$', 'regulator_detail',name='regulator_detail'),

    url(r'^contact/$', 'contact',name='contact'),
    url(r'^downloads/$', 'downloads', name='downloads'),
    url(r'^search/$', 'search', name='search'),

    url(r'^sitemap/$', 'sitemap', name='sitemap'),

    url(r'^species/$', 'species', name='species'),
    url(r'^species/(?P<species>[^/]*)/?$', 'species', name='species'),
)
