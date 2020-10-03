# step 2: creating classes

#migrate every time you change something

# change name in katong users py
import uuid
from django.db import models
from django.contrib.auth.models import User
from login_register.auxfunctions import *
from enum import Enum
#from django.utils import timezone
# Create your models here

class Months(Enum):
    January = 1
    Febuary = 2
    March = 3
    April = 4
    May = 5
    June = 6
    July = 7
    August = 8
    September = 9
    October = 10
    November = 11
    December = 12

class Crop(models.Model):
    name = models.CharField(max_length=220)
    is_seasonal = models.BooleanField()
    season_start = models.CharField(max_length=20,choices=[(tag, tag.value) for tag in Months],blank=True,null=True,\
                    help_text="Start of the harvest season.")
    season_end = models.CharField(max_length=20,choices=[(tag, tag.value) for tag in Months],blank=True,null=True, \
                    help_text="End of the harvest seasons.")
    harvest_weight_per_land_area = models.FloatField(help_text="Harvest weight per land area in tons/ha")
    harvest_time = models.PositiveIntegerField(help_text="Harvest time in days")
    productivity = models.FloatField(help_text="Arbitrary for now, set it later can be overriden.")

    def __str__(self):
        return str(self.name)

class Location(models.Model):
    name = models.CharField(max_length=220)
    # to match the html form
    street = models.CharField(max_length=100,default="")
    brgy = models.CharField(max_length=50,default="")
    city = models.CharField(max_length=50,default="")
    province = models.CharField(max_length=50,default="")
    def __str__(self):
        return str(self.name)

class Soil_type(models.Model):
    name = models.CharField(max_length=220)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Soil Types"

class Location_Soil(models.Model):
    location = models.ForeignKey(Location, null=True, on_delete=models.CASCADE)
    soil_type = models.ManyToManyField(Soil_type)

    def __str__(self):
        return "{} - {}".format(self.location, self.soil_type)

    class Meta:
        verbose_name_plural = "Location-Soil type Relations"

class Location_Crop(models.Model):
    location = models.ForeignKey(Location, null=True, on_delete=models.CASCADE)
    name = models.ManyToManyField(Crop, help_text="Crop name")

    def __str__(self):
        return "{} - {}".format(self.location, self.name)

    class Meta:
        verbose_name_plural = "Location-Crop Relations"

class Crop_Soil(models.Model):
    name = models.ForeignKey(Crop, null=True, on_delete=models.CASCADE, help_text="Crop name")
    soil_type = models.ManyToManyField(Soil_type)

    def __str__(self):
        return "{} - {}".format(self.name, self.soil_type)

    class Meta:
        verbose_name_plural = "Crop-Soil type Relations"

class Customer(models.Model):
    name = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location,on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=14)
    company = models.CharField(max_length=30,null=True,blank=True)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True)
    is_approved = models.BooleanField(default=False)

    def set_value(self, attr:str, new_value):
        try:
            setattr(self,attr,new_value)
            self.save()
        except:
            pass

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    def __str__(self):
        return str(self.name)

    def get_customer_name(self):
        return get_name(self.contact_number)

    class Meta:
        ordering = ['name']


class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    crop = models.OneToOneField(Crop, on_delete=models.CASCADE)
    order_date = models.DateTimeField(blank=True, auto_now_add=True, verbose_name=True)
    weight = models.FloatField()
    is_done = models.BooleanField(help_text="Is the order finished?")
    is_cancelled = models.BooleanField(help_text="Is the order cancelled?")

    def is_eligible(self):
        pass

    def set_value(self, attr:str, new_value):
        try:
            setattr(self,attr,new_value)
            self.save()
        except:
            pass

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    def __str__(self):
        return "{} - {} kg of {}".format(self.customer,self.weight,self.crop)

    class Meta:
        ordering = ["-order_date"]

class Farmer(models.Model):
    name = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=14, verbose_name=True)
    company = models.CharField(max_length=30,null=True,blank=True)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True, verbose_name=True)
    is_approved = models.BooleanField(default=False)
    land_area = models.FloatField(help_text="Farmer's land area in square meters", null=True)
    is_available = models.BooleanField(help_text="Is the farmer able to take up orders?", null=True)

    def set_value(self, attr:str, new_value):
        try:
            setattr(self,attr,new_value)
            self.save()
        except:
            pass

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    def __str__(self):
        return str(self.name)

    def get_farmer_name(self):
        return get_name(self.contact_number)

    class Meta:
        ordering = ['location','name','-registration_date']

class Order_Pairing(models.Model):
    order_id = models.OneToOneField(Order, on_delete=models.CASCADE)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    expected_time = models.DateTimeField(blank=True,null=True)

    def __str__(self):
        return "{} - {}".format(self.order_id,self.farmer)

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    class Meta:
        ordering = ['-expected_time']
        verbose_name_plural = "Order Pairings"
