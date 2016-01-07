from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from .forms import UploadFileForm
from .models import image_model_main
import pyfits
import os
from fits_to_jpeg import fits_to_jpeg

def upload_file(request):

	form=UploadFileForm(request.POST, request.FILES)

	if request.method=='POST':

		if form.is_valid():

			html=""
			post_data_dict=request.POST.dict()

			STOR_DIR="/home/alexander/Desktop/hou_global/db_temp/"
			path_list=[]
			for file_at_n in request.FILES.getlist('files'):
				path_list.append(STOR_DIR+file_at_n.name)

				temp_card_values={}
				important_card_values={}
				for data in post_data_dict:

					if data.find(file_at_n.name)!=-1: #if it finds it

						truncated_data=data.replace(file_at_n.name+'_','')
						temp_card_values.update({truncated_data:post_data_dict.get(data)})

				n_object_name=temp_card_values.get("OBJECT")
				n_observer_name=temp_card_values.get("OBSERVER")
				n_observatory_name=temp_card_values.get("OBSERVAT")
				n_telescope_name=temp_card_values.get("TELESCOP")
				n_RA=temp_card_values.get("RA"),
				n_DEC=temp_card_values.get("DEC")
			        n_filter_name=temp_card_values.get("FILTER")
				header_dict={}
				comment_dict={}
				comment_list=[]

				for i, pair in enumerate(temp_card_values):
					if temp_card_values.keys()[i].find('comment')==-1:

						header_dict[pair]=temp_card_values.get(pair)
					else:

						comment_dict[pair]=temp_card_values.get(pair).strip()




				image=image_model_main(file_field=file_at_n,  object_name=n_object_name,
				observer_name=n_observer_name, observatory_name=n_observatory_name,
				telescope_name=n_telescope_name, RA=n_RA, DEC=n_DEC,filter_name=n_filter_name,
				header_data_other=header_dict,header_comments=comment_dict)



				image.file_field.save(file_at_n.name, file_at_n)
				image.save()

				stored_file=pyfits.open(STOR_DIR+file_at_n.name, mode='update')
				stored_file_header=stored_file[0].header

				for card in header_dict:

					if 'NAXIS' in str(card):

						stored_file_header[str(card)]=int(str(temp_card_values.get(card)))


					elif 'SIMPLE' in str(card):

						stored_file_header[str(card)]=bool(str(temp_card_values.get(card)))

					else:

						try:
							stored_file_header[str(card)]=float(str(temp_card_values.get(card)))

						except ValueError:

							try:
								stored_file_header[str(card)]=int(str(temp_card_values.get(card)))
							except ValueError:
								stored_file_header[str(card)]=str(temp_card_values.get(card))

				for card in comment_dict:
					stored_file_header.comments[str(card).strip('_comment')]=str(temp_card_values.get(card));


				stored_file.close(output_verify="ignore")
			convert_to_jpeg(path_list)
			return HttpResponse("<h1>SUCCESS</h1>")

		else:
			form=UploadFileForm()

	if request.user.is_authenticated():

		return render(request, 'uploader.html', {'form':form,})
	else:

		return HttpResponse('Please log in to access the uploader')


def convert_to_jpeg(file_list):

	#this function takes image names as arguments, gets the images
	#from the database folder, makes a temporary jpeg copy, and
	#puts it in /static/images/temp/[image_name].jpg.

	for i in file_list:

		fits_to_jpeg(i) #get filenames from pk
