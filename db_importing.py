from login_register.connectivefunctions import *
import csv
import re


def import_crops():
	with open("finacrops.csv") as f:
		reader = csv.reader(f)
		for row in reader:
			if row[0] != "":
				created = Crop.objects.get_or_create(
				name=row[1],
				season_start=row[2],
				season_end=row[3],
				productivity=row[4],
				is_seasonal=row[6],
				harvest_weight_per_land_area=row[7],
				harvest_time=row[8]
				)

def import_pairings():
	with open("pairing.csv") as f:
		reader = csv.reader(f)
		for row in reader:
			if row[1] != "Province":
				print(row[1])
				created = Location_Crop(location=Location.objects.get(name=row[1]))
				created.save()
				for i in [x for x in re.split('[|]|,|\'',row[2]) if len(x) > 1]:
					if "[" in i:
						i = i[1:]
					if "]" in i:
						i = i[:-1]
					if "Pechay" in i:
						i = "Pechay, Native"
					if "Ladys" in i:
						i = "Lady\'s finger/Okra"
					created.name.add(Crop.objects.get(name=i))

