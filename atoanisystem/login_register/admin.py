from django.contrib import admin
from login_register.models import *
# Register your models here.
admin.site.register(Customer)
admin.site.register(Farmer)
admin.site.register(Location)
admin.site.register(Crop)
admin.site.register(Soil_type)
admin.site.register(Location_Soil)
admin.site.register(Location_Crop)
admin.site.register(Crop_Soil)
admin.site.register(Order)
admin.site.register(Order_Pairing)
