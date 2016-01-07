from django.db import models
from django_hstore import hstore



# Create your models here.
class image_model_main(models.Model):

	file_field=models.FileField(upload_to="/home/alexander/Desktop/hou_global/db_temp/",max_length=500)
	object_name=models.TextField(max_length=20, blank=True,null=True)
	observer_name=models.TextField(max_length=30, blank =True,null=True)
	observatory_name=models.TextField(max_length=30, blank =True, null=True)
	telescope_name=models.TextField(max_length=30, blank =True, null=True)
	RA=models.TextField(max_length=30, blank =True,null=True)
	DEC=models.TextField(max_length=30, blank=True,null=True)
	filter_name=models.TextField(max_length=10, blank=True,null=True)
	#uploaded_on=models.DateTimeField(blank=True,null=True)
	date_time=models.DateTimeField(blank=True,null=True)
	header_data_other=hstore.DictionaryField(null=True,blank=True)
	header_comments=hstore.DictionaryField(null=True,blank=True)
	objects=hstore.HStoreManager()
