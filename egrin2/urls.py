from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('main.views',
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

    url(r'^gene_conditions_json/$', 'gene_conditions_json',name='gene_conditions_json'),
    url(r'^gene_conditions_json/(?P<species>[^/]*)/(?P<gene>[^/]*)/?$',
        'gene_conditions_json', name='gene_conditions_json'),

    url(r'^gre_conditions_json/$', 'gre_conditions_json',name='gre_conditions_json'),
    url(r'^gre_conditions_json/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$',
        'gre_conditions_json', name='gre_conditions_json'),

    ##############################################################################
    # BICLUSTERS
    ##############################################################################
    url(r'^biclusters_json/$', 'biclusters_json', name='biclusters_json'),
    url(r'^biclusters_json/(?P<species>[^/]*)/?$', 'biclusters_json', name='biclusters_json'),

    url(r'^corem_biclusters_json/$', 'corem_biclusters_json', name='corem_biclusters_json'),
    url(r'^corem_biclusters_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_biclusters_json', name='corem_biclusters_json'),

    url(r'^condition_biclusters_json/$', 'condition_biclusters_json',
        name='condition_biclusters_json'),
    url(r'^condition_biclusters_json/(?P<species>[^/]*)/(?P<condition>[^/]*)/?$',
        'condition_biclusters_json', name='condition_biclusters_json'),

    url(r'^gene_biclusters_json/$', 'gene_biclusters_json',
        name='gene_biclusters_json'),
    url(r'^gene_biclusters_json/(?P<species>[^/]*)/(?P<gene>[^/]*)/?$',
        'gene_biclusters_json', name='gene_biclusters_json'),

    url(r'^gre_biclusters_json/$', 'gre_biclusters_json', name='gre_biclusters_json'),
    url(r'^gre_biclusters_json/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$',
        'gre_biclusters_json', name='gre_biclusters_json'),

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

    url(r'^condition_corems_json/$', 'condition_corems_json',name='condition_corems_json'),
    url(r'^condition_corems_json/(?P<species>[^/]*)/(?P<condition>[^/]*)/?$',
        'condition_corems_json', name='condition_corems_json'),

    url(r'^gre_corems_json/$', 'gre_corems_json',name='gre_corems_json'),
    url(r'^gre_corems_json/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$',
        'gre_corems_json', name='gre_corems_json'),

    ##############################################################################
    # GENES
    ##############################################################################

    url(r'^genes/$', 'genes',name='genes'),
    url(r'^genes/(?P<species>[^/]*)/?$', 'genes',name='genes'),
    url(r'^genes/(?P<species>[^/]*)/(?P<gene>[^/]*)/?$', 'gene_detail',name='gene_detail'),
    
    # filling genes tables with JSON data
    url(r'^genes_json/$', 'genes_json',name='genes_json'),
    url(r'^genes_json/(?P<species>[^/]*)/?$', 'genes_json', name='genes_json'),

    # returning annotation data to populate ggbrowserweb - dsalvanha
    url(r'^genes_json_annotation/$', 'genes_json_annotation',name='genes_json_annotation'),
    url(r'^genes_json_annotation/(?P<species>[^/]*)/?$', 'genes_json_annotation', name='genes_json_annotation'),
    url(r'^genes_json_annotation/(?P<species>[^/]*)/(?P<start>\d+)/(?P<stop>\d+)/(?P<refseq>[^/]*)/?$', 'genes_json_annotation_range', name='genes_json_annotation_range'),


    #returning basepairs given a range - dsalvanha

    url(r'^basepair_json_range/(?P<species>[^/]*)/(?P<start>\d+)/(?P<stop>\d+)/(?P<refseq_>[^/]*)/?$', 'basepair_jsons_range', name='basepair_jsons_range'),

    # returnin CREs for ggbrowserweb
    url(r'^cres_in_range/(?P<species>[^/]*)/(?P<start>\d+)/(?P<stop>\d+)/(?P<top>\d+)/(?P<gene_name>[^/]*)/(?P<refseq>[^/]*)/?$', 'cres_in_range_json', name='cres_in_range_json'),


# returnin CREs for ggbrowserweb given a list of biclusters
    url(r'^cres_in_range_list/(?P<species>[^/]*)/(?P<start>\d+)/(?P<stop>\d+)/(?P<top>\d+)/(?P<gene_name>[^/]*)/(?P<refseq>[^/]*)/?$', 'cres_in_range_json_list', name='cres_in_range_json_list'),

    # list of corem-specific genes
    url(r'^corem_genes_json/$', 'corem_genes_json',name='corem_genes_json'),
    url(r'^corem_genes_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_genes_json', name='corem_genes_json'),

    ##############################################################################
    # GRES
    ##############################################################################

    url(r'^gres/$', 'gres',name='gres'),
    url(r'^gres/(?P<species>[^/]*)/?$', 'gres_s',name='gres_s'),
    url(r'^gres/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$', 'gre_detail',name='gre_detail'),

    url(r'^corem_gres_json/$', 'corem_gres_json',name='corem_gres_json'),
    url(r'^corem_gres_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_gres_json', name='corem_gres_json'),

    url(r'^gene_gres_json/$', 'gene_gres_json',name='gene_gres_json'),
    url(r'^gene_gres_json/(?P<species>[^/]*)/(?P<gene>[^/]*)/?$',
        'gene_gres_json', name='gene_gres_json'),

    url(r'^condition_gres_json/$', 'condition_gres_json',name='condition_gres_json'),
    url(r'^condition_gres_json/(?P<species>[^/]*)/(?P<condition>[^/]*)/?$',
        'condition_gres_json', name='condition_gres_json'),
    
    ##############################################################################
    # OTHER
    ##############################################################################

    url(r'^gre_cres_json/$', 'gre_cres_json',name='gre_cres_json'),
    url(r'^gre_cres_json/(?P<species>[^/]*)/(?P<gre>[^/]*)/?$',
        'gre_cres_json', name='gre_cres_json'),




    # list of corem-specific go_ids
    url(r'^corem_go_json/$', 'corem_go_json',name='corem_go_json'),
    url(r'^corem_go_json/(?P<species>[^/]*)/(?P<corem>[^/]*)/?$',
        'corem_go_json', name='corem_go_json'),

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
