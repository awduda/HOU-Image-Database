#!/usr/bin/env python

import os
import sys
import time
import numpy
from numpy import *
import pyfits
import scipy, scipy.misc



def fits_to_jpeg(path):
	
	
	data=pyfits.getdata(path) #gets data of fits file
	x=data.shape[1] #reverses because of weird x,y coordinate system (backwards in computers)
	y=data.shape[0]
	data=fliplr(rot90(data, 2)) #flips it for correct orientation
	data=data.copy() #avoids some weird error...
	dimensions=x*y
	scaleArray=data.copy()
	scaleArray.shape=(dimensions,)
	scaleArray.sort()
	smin=scaleArray[dimensions/600]
	smax=scaleArray[dimensions-dimensions/600]
	scaleimg=255.0*(data-smin)/(smax-smin) 
	#scales image color values to be better represented. Arbitrary scaling.
	scaleimg[scaleimg<0]=0.0
	scaleimg[scaleimg>255]=255
	data=scaleimg.copy()



	'''if x>500 and x>=y: #resizes image to fit in display area. Now works with rectangles.
		change=x/500.0

		newX=x/change
		newY=y/change

	elif y>500 and y>x:
		change=y/500.0
		newX=x/change
		newY=y/change

	elif y>500 and x>500:
		if x>y:
		    change=x/500.

		    newX=x/change
		    newY=y/change


		elif y>x:
		    change=y/500.0
		    newX=x/change
		    newY=y/change
	elif x<500 and x>=y:
		change=x/500.0
		newX=x/change
		newY=y/change'''

	newX=x;
	newY=y;
	newX=int(newX)
	newY=int(newY)

	filename=os.path.basename(path)
	filename=os.path.splitext(filename)[0]
	filepath="/home/alex/Desktop/hou_global/static/images/" + filename+".jpg"
	data=scipy.misc.imresize(data, (newX, newY))
	scipy.misc.imsave(filepath, data)#saves it to mollify temp dir

