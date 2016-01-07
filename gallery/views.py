from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from django.http import HttpResponse
import pyfits
from fits_to_jpeg import fits_to_jpeg
import os
from uploader.models import image_model_main
from django.core import serializers
import json
# Create your views here.

IMAGE_PATH='/home/alexander/Desktop/hou_global/db_temp/'

def gallery_main(request):

	query=request.GET.get('query','')

	image_results_list=[]

	image_pk_list=search_interpret(query)


	for image in image_pk_list:

		image_results_list.append(image.pk)



	if request.is_ajax():

		num=request.GET.get('i','')
		image_to_get=request.GET.get('info_id','')
		initial=request.GET.get('initial','')
		get_pk=request.GET.get('get_pk','')
		table_data=request.GET.get('table_data','')

		if num!='':

			num=str(int(num))
			return HttpResponse(image_pk_list.filter(pk=num)[0].file_field.name.split(IMAGE_PATH))


		elif initial!='':

			return HttpResponse(image_pk_list.count())

		elif image_to_get!='':
			#do query again
			image=image_pk_list.filter(pk=int(image_to_get)) #get corresponding image model. USE UNIQUE ID
			json_encoded=serializers.serialize("json", image)

			return HttpResponse(json_encoded)

		elif table_data!='':

			data_list=[]
			temp_list=[]


			table_data=table_data.replace("[", "").replace("]","")
			start= int(table_data[0:table_data.find(',')])
			end=int(table_data[(table_data.find(',')+1):len(table_data)])

			for i in range(int(start),int(end)):

				temp_list.append('test')
				temp_list.append(image_pk_list[i].observatory_name)
				temp_list.append(image_pk_list[i].telescope_name)
				temp_list.append(image_pk_list[i].object_name)
				temp_list.append(image_pk_list[i].observer_name)
				temp_list.append(image_pk_list[i].date_time)
				temp_list.append(image_pk_list[i].RA)
				temp_list.append(image_pk_list[i].DEC)
				data_list.append(temp_list)

			return HttpResponse(json.dumps(data_list))

		elif get_pk!='':
			get_pk=get_pk.replace("[", "").replace("]","")
			start= int(get_pk[0:get_pk.find(',')])
			end=int(get_pk[(get_pk.find(',')+1):len(get_pk)])

			return HttpResponse(json.dumps(image_results_list[start:end]))


	else:

		#take associated image list. if list empty, show random.
		#use separate function to make jpeg copies
		#pushes list to javascript

		#convert_to_jpeg(image_results_list)

		return render(request,'gallery.html', {'x':image_results_list})


def convert_to_jpeg(file_list):

	#this function takes image names as arguments, gets the images
	#from the database folder, makes a temporary jpeg copy, and
	#puts it in /static/images/temp/[image_name].jpg.

	for i in file_list:

		fits_to_jpeg(image_model_main.objects.all().filter(pk=i)[0].file_field.name) #get filenames from pk

def search_interpret(search):

	search=search.split()
	final_query=image_model_main.objects.all();
	separator_list=["of","and","or","by","taken","by","at","from","with","uploaded","on"]

	if "of" in search:
		check=search[search.index("of")+1]
		final_query=final_query.filter(object_name__icontains=check)

	if "and" in search:
		pass
	if "or" in search:
		pass #do exclude stuff

	'''if "taken" in search:

		check=search[search.index("taken")+1]

		if check=="on":
			check=search[search.index("on")+1]
			pass #do date stuff
		if check=="by":
			check=search[search.index("by")+1]
			final_query=final_query.filter(observer_name__icontains=check)

		if check=="at":
			check=search[search.index("at")+1]
			final_query=final_query.filter(observatory_name__icontains=check)

		if check=="from":
			check=search[search.index("from")+1]
			final_query=final_query.filter(telescope_name__icontains=check)


		if check=="with":
			check=search[search.index("with")+1]
			final_query=final_query.filter(telescope_name__icontains=check)


	if "from" in search:

		check=search[search.index("from")+1]
		final_query=final_query.filter(observatory_name__icontains=check)

	if "by" in search:

		check=search[search.index("by")+1]
		final_query=final_query.filter(observer_name__icontains=check)

	if "with" in search:

		check=search[search.index("with")+1]
		card=search[search.index("with")+1]



	if "uploaded by" in search:

		pass #filter for user_name

	if "uploaded on" in search:

		pass #filter for user_name'''

	return final_query
