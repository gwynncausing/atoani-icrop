# step 2: creating classes

#migrate every time you change something
# create mutations for status
# change name in katong users py
import uuid
from django.db import models
from django.contrib.auth.models import User
from login_register.auxfunctions import *
from enum import Enum
from django.utils import timezone as tz
from datetime import datetime as dt
import copy
from django.db.models import Q
# Create your models here

# https://stackoverflow.com/questions/54802616/how-to-use-enums-as-a-choice-field-in-django-model
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

    @classmethod
    def choices(cls):
        print((i.name,i.value) for i in cls)
        return((i.name,i.value) for i in cls)

class Crop(models.Model):
    name = models.CharField(max_length=220)
    is_seasonal = models.BooleanField()
    season_start = models.CharField(max_length=20,choices=Months.choices(),blank=True,null=True,\
                    help_text="Start of the harvest season.")
    season_end = models.CharField(max_length=20,choices=Months.choices(),blank=True,null=True, \
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
    location = models.ManyToManyField(Location)
    contact_number = models.CharField(max_length=14,null=True, blank=True)
    company = models.CharField(max_length=30,null=True,blank=True)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True)
    is_approved = models.BooleanField(default=False)

    def set_value(self, attr:[]):
        try:
            for att in attr:
                setattr(self,att[0],att[1])
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

    def get_locations(self):
        return self.location.all().values_list('name','id')

    def add_location(self,location_id):
        self.location.add(location_id)

    class Meta:
        ordering = ['name']


class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    order_date = models.DateTimeField(default=tz.now, verbose_name="Order date", help_text = "Date in which the order was done")
    weight = models.FloatField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
    land_area_needed = models.FloatField(null=True, blank=True)
    is_done = models.BooleanField(help_text="Is the order finished?",default=False)
    is_reserved = models.BooleanField(help_text="Is  the order reserved?",default=False)
    is_approved = models.BooleanField(help_text="Is the order approved by AtoANI?",default=False)
    # status = models.CharField(max_length=20, choices=Status.choices(),null=True, default="Pending")
    status = models.CharField(max_length=20, null=True, default="Pending")
    message = models.CharField(max_length=1000, null=True, blank=True, help_text="Cancellation Message")

    def is_eligible(self):
        pass

    def set_value(self, attr:[]):
        try:
            for att in attr:
                setattr(self,att[0],att[1])
            self.save()
            print(self.status)
        except:
            pass


    def save(self, *args, **kwargs):
        if self.is_approved and self.status == "Pending":
            self.status = "Posted"
        super().save(*args, **kwargs)

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    def __str__(self):
        return "{} - {} kg of {}".format(self.customer,self.weight,self.crop)

    class Meta:
        ordering = ["-order_date"]

# re:available_land_area, raise this concern
class Farmer(models.Model):
    name = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=14, verbose_name=True, null=True, blank=True)
    company = models.CharField(max_length=30,null=True,blank=True)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True, verbose_name=True)
    is_approved = models.BooleanField(default=False)
    land_area = models.FloatField(help_text="Farmer's land area in square meters", null=True)
    is_available = models.BooleanField(help_text="Is the farmer able to take up orders?", null=True)
    available_land_area = models.FloatField(blank=True, null=True, help_text="Available planting land of farmer")

    def save(self, *args, **kwargs):
        orig = Farmer.objects.get(name=self.name)
        # checks if land_area has changed
        if orig.land_area != self.land_area:
            self.available_land_area = self.land_area
        # updates available_land_area based on ongoing orders
        if self.available_land_area == self.land_area:
            for order in Order_Pairing.objects.filter(Q(farmer_id = self.id) & Q(status = "Ongoing")):
                self.available_land_area = self.available_land_area - order.order_id.land_area_needed
        super().save(*args, **kwargs)

    def set_value(self, attr:[]):
        try:
            for att in attr:
                setattr(self,att[0],att[1])
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

    def add_land(new_land_area):
        self.available_land_area = self.available_land_area+new_land_area
        self.save()

    def subtract_land(new_land_area):
        self.available_land_area = self.available_land_area-new_land_area
        self.save()

    class Meta:
        ordering = ['location','name','-registration_date']

class Order_Pairing(models.Model):
    order_id = models.OneToOneField(Order, on_delete=models.CASCADE)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    expected_time = models.DateTimeField(blank=True,null=True)
    accepted_date = models.DateTimeField(blank=True,null=True, default=tz.now)
    harvested_date = models.DateTimeField(blank=True,null=True)
    collected_date = models.DateTimeField(blank=True,null=True, help_text="To be filled up by AtoAni")
    status = models.CharField(max_length=100, default="Ongoing")

    def __str__(self):
        return "{} - {}".format(self.order_id,self.farmer)

    def get_value(self, attr:str):
        try:
            return getattr(self,attr)
        except:
            return None

    def set_value(self, attr:[]):
        try:
            for att in attr:
                setattr(self,att[0],att[1])
            self.save()
        except:
            pass

    def save(self, *args, **kwargs):
        status = "Ongoing" if self.harvested_date == None else "Harvested" if self.harvested_date != None and self.collected_date == None else "Collected" if self.collected_date != None else ""
        if self.status != status:
            # status has changed
            self.status = status
            super().save(*args, **kwargs)
            # sets order to the same status as the pairing
            Order.objects.get(order_id=self.order_id_id).set_value([['status',status]])
            farmer = Farmer.objects.get(id=self.farmer_id)
            if status == "Ongoing":
                farmer.subtract_land(self.order_id.land_area)
            elif status == "Harvested":
                # Farmer.objects.get()
                farmer.add_land(self.order_id.land_area)
    #Add get_status(self) after boss martin pushes his changes to order_pair model

    class Meta:
        ordering = ['-expected_time']
        verbose_name_plural = "Order Pairings"
