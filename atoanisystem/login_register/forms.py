from django import forms

from .models import Customer, Farmer


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer

        

class FarmerForm(forms.ModelForm):
    class Meta:
        model = Farmer

    