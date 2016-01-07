from django.shortcuts import render
from .forms import main_search_form
from django.http import HttpResponse, HttpResponseRedirect
from uploader.models import image_model_main
from django.contrib.auth import authenticate, login, logout
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
import json
from uploader.models import image_model_main
from random import shuffle

IMAGE_PATH='/home/alexander/Desktop/hou_global/db_temp/'

@csrf_protect
def main_page(request):

	main_search=main_search_form(request.POST)

	if request.method=='POST' and request.is_ajax()==False:

		search = request.POST.get('search_input', None)
		return HttpResponseRedirect('/database/?query='+search)

	elif request.is_ajax()==True:

		if len(request.POST)==2:

			username = request.POST['username']
			password = request.POST['password']

			user=authenticate(username=username, password=password)

			if user is not None:
				login(request,user)
				user_info=[user.first_name,user.last_name]
				return HttpResponse(json.dumps(user_info))

			else:
				return HttpResponse(json.dumps(['unauthorized']))
		else:
			action=request.POST['action']
			if action=='is_logged_in':
				if request.user.is_authenticated():
					user_info=[request.user.first_name,request.user.last_name]
					return HttpResponse(json.dumps(user_info))
				else:
					return HttpResponse(json.dumps(['not logged in']))
			if action=='logout':
				logout(request)
				return HttpResponse('logged out')

			if action=='get_random_image':

				image_list=image_model_main.objects.all()[0:50]

				name_list=[]
				for image in image_list:
					name_list.append(image.file_field.name.replace(IMAGE_PATH,"").split('.')[0]+'.jpg')

				shuffle(name_list)
				return HttpResponse(json.dumps(name_list))

	else:

		main_search=main_search_form()


	return render(request, 'index.html', {'main_search':main_search,})
