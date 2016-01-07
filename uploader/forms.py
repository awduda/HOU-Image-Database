from django import forms

class UploadFileForm(forms.Form):

	files=forms.FileField(label="",required=False,widget=forms.FileInput(attrs={'multiple':'multiple'}))


