from django.conf.urls import url

urlpatterns=[
	url(r'^$','gallery.views.gallery_main',name='gallery_main_view')
]
