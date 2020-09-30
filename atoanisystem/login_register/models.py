# step 2: creating classes

#migrate every time you change something

#many to many field ??
# change name in katong users py
import uuid
from django.db import models
from django.contrib.auth.models import User
#from django.utils import timezone
# Create your models here

class Crop(models.Model):
    name = models.CharField(max_length=220)
    is_seasonal = models.BooleanField()
    season_start = models.PositiveIntegerField(blank=True,null=True)
    season_end = models.PositiveIntegerField(blank=True,null=True)
    land_area_requirement = models.FloatField()
    harvest_weight_per_land_area = models.FloatField()
    harvest_time = models.PositiveIntegerField()
    productivity = models.FloatField()

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=220)

    def __str__(self):
        return self.name

class Soil_type(models.Model):
    name = models.CharField(max_length=220)

    def __str__(self):
        return self.name

class Location_Soil(models.Model):
    location = models.ManyToManyField(Location)
    soil_type = models.ManyToManyField(Soil_type)

    def __str__(self):
        return "{} - {}".format(self.location, self.soil_type)

    class Meta:
        verbose_name_plural = "Location-Soil type Relations"

class Location_Crop(models.Model):
    location = models.ManyToManyField(Location)
    name = models.ManyToManyField(Crop)

    def __str__(self):
        return "{} - {}".format(self.location, self.name)

    class Meta:
        verbose_name_plural = "Location-Crop Relations"

class Crop_Soil(models.Model):
    soil_type = models.ManyToManyField(Soil_type)
    name = models.ManyToManyField(Crop)

    def __str__(self):
        return "{} - {}".format(self.name, self.soil_type)

    class Meta:
        verbose_name_plural = "Crop-Soil type Relations"

class Customer(models.Model):
    name = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location_Soil,on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=14)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True)

    def set_location(self, new_location):
        setattr(self, 'location', new_location)
        self.save()

    def set_contact_number(self, new_number):
        setattr(self, 'contact_number', new_number)
        self.save()

    def __str__(self):
        return str(self.name)

class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    order_date = models.DateTimeField(blank=True, auto_now_add=True, verbose_name=True)
    weight = models.FloatField()
    is_done = models.BooleanField(help_text="Is the order finished?")
    is_cancelled = models.BooleanField(help_text="Is the order cancelled?")

    def is_eligible(self):
        pass

    def set_weight(self, new_weight):
        # is_eligible
        setattr(self, 'weight', new_weight)
        self.save()
        return True

    def set_is_done(self):
        setattr(self,'is_done', True)
        self.save()

    def set_is_cancelled(self):
        # condition diri based sa pila ka days, is_eligibility
        setattr(self,'is_cancelled',True)
        self.save()
        return True
        # if not, return false

    def get_id(self):
        return self.order_id

    def __str__(self):
        return "{} - {} kg of {}".format(self.customer,self.weight,self.crop)

    class Meta:
        ordering = ["-order_date"]

class Farmer(models.Model):
    name = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location_Soil, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=14, verbose_name=True)
    registration_date = models.DateTimeField(auto_now_add=True, blank=True, verbose_name=True)
    land_area = models.FloatField(help_text="Farmer's land area in square meters")
    is_available = models.BooleanField(help_text="Is the farmer able to take up orders?")

    def set_location(self, new_location):
        setattr(self, 'location', new_location)
        self.save()

    def set_contact_number(self, new_number):
        setattr(self,'contact_number',new_number)
        self.save()

    def set_land_area(self, new_area):
        setattr(self, 'land_area', new_area)
        self.save()

    def set_is_available(self, value):
        setattr(self, 'is_available', value)
        self.save()

    def __str__(self):
        return str(self.name)

    class Meta:
        ordering = ['location','name','-registration_date']

class Order_Pairing(models.Model):
    order_id = models.OneToOneField(Order, on_delete=models.CASCADE)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    expected_time = models.DateTimeField(blank=True,null=True)

    def __str__(self):
        return "{} - {}".format(self.order_id,self.farmer)

    class Meta:
        ordering = ['-expected_time']
