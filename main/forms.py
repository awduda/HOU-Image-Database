from django import forms

class main_search_form(forms.Form):
	search_input = forms.CharField(label="", required=False, max_length=300,widget=forms.TextInput(attrs={'placeholder': 'Explore our universe:'}))
