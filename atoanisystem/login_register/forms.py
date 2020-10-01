from django import forms
from .models import Farmer, Customer, Location

class FarmerForm(forms.ModelForm):
    middlename = forms.CharField(required=False)
    company = forms.CharField(required=False)
    location = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Farmer
        # fields to check for is_valid() method
        fields = (  'middlename',
                    #contact
                    'contact_number',
                    #company
                    'company',
                    )
class CustomerForm(forms.ModelForm):
    middlename = forms.CharField(required=False)
    company = forms.CharField(required=False)
    location = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Customer
        # fields to check for is_valid() method
        fields = (  'middlename',
                    #contact
                    'contact_number',
                    #company
                    'company',
                    )
class Location(forms.ModelForm):
    street = forms.CharField(required=False)
    # use the class Meta to specify the model for the customer form
    class Meta:
        model = Location
        # fields to check for is_valid() method
        fields = ('street', 'brgy', 'city', 'province',)
