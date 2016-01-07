from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hou_global.views.home', name='home'),
    
    url(r'^search/', include('haystack.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'main.views.main_page', name='main'),
    url(r'^uploader/', include('uploader.urls')),
    url(r'^database/', include('gallery.urls')),
)
