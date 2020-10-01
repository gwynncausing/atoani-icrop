from django import forms
from .models import Farmer, Customer, Location

class FarmerForm(forms.ModelForm):
    middlename = forms.CharField(required=False)
    street = forms.CharField(required=False)
    email = forms.CharField(required=False)
    company = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Farmer
        # fields to check for is_valid() method
        fields = (  'firstname', 'middlename', 'lastname',
                    #address
                    'street', 'brgy', 'city', 'province',
                    #contact
                    'email','contact_number',
                    #company
                    'company',
                    )
class CustomerForm(forms.ModelForm):
    middlename = forms.CharField(required=False)
    street = forms.CharField(required=False)
    email = forms.CharField(required=False)
    company = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Customer
        # fields to check for is_valid() method
        fields = (  'firstname', 'middlename', 'lastname',
                    #address
                    'street', 'brgy', 'city', 'province',
                    #contact
                    'email','contact_number',
                    #company
                    'company',
                    )
class Location(forms.ModelForm):
    street = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Farmer
        # fields to check for is_valid() method
        fields = ('street', 'brgy', 'city', 'province',)