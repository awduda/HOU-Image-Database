from django.conf.urls import url

urlpatterns=[
	url(r'^$','uploader.views.upload_file',name='uploader_main_view')
]
