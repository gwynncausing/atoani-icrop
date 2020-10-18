from django import forms
from .models import Farmer, Customer, Location
from django.contrib.auth.models import User

class FarmerForm(forms.ModelForm):
    name = forms.ModelChoiceField(queryset=User.objects.all(),required=False)
    middlename = forms.CharField(required=False)
    company = forms.CharField(required=False)
    location = forms.ModelChoiceField(queryset=Location.objects.all(),required=False)
    contact_number = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Farmer
        # fields to check for is_valid() method
        fields = (  'name','middlename',
                    #company
                    'company',
                    #location
                    'location'
                    )
class CustomerForm(forms.ModelForm):
    name = forms.ModelChoiceField(queryset=User.objects.all(),required=False)
    middlename = forms.CharField(required=False)
    company = forms.CharField(required=False)
    location = forms.ModelChoiceField(queryset=Location.objects.all(),required=False)
    contact_number = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Customer
        # fields to check for is_valid() method
        fields = (  'name','middlename',
                    #company
                    'company',
                    #location
                    'location'
                    )
class LocationForm(forms.ModelForm):
    street = forms.CharField(max_length=220, required=False)
    name = forms.CharField(max_length=220, required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Location
        # fields to check for is_valid() method
        fields = ('street', 'brgy', 'city', 'province',)
