from django.db import models
#from custom_auth.models import CustomUser

class Course(models.Model):
	idcourse = models.AutoField(primary_key = True)
	title = models.CharField(max_length = 50)
	level = models.CharField(max_length = 2)
	instructions = models.CharField(max_length = 500)#for the teacher to read and apply
	description = models.CharField(max_length = 2000)#for people too see what the course is about
	#in the page /educationoffer, description is "Ziel"

class TeacherCourse(models.Model):
	idteachercourse = models.AutoField(primary_key = True)
	fkteacher = models.ForeignKey('custom_auth.CustomUser', on_delete=models.CASCADE, null = True,blank = True)
	fkcourse = models.ForeignKey(Course, on_delete = models.CASCADE, null = True,blank = True)

class Topic(models.Model):
	id_topic= models.AutoField(primary_key = True)
	name = models.CharField(max_length=100)
	fk_course = models.ForeignKey(Course, on_delete = models.CASCADE)

class ProfitiencyLevel(models.Model):
	idprofitiency = models.AutoField(primary_key = True)
	fk_id_participant = models.ForeignKey('custom_auth.CustomUser', on_delete = models.CASCADE)
	level = models.CharField(max_length = 2)

class TravelPetition(models.Model):
	idpetition = models.AutoField(primary_key = True)
	fk_id_student = models.ForeignKey('custom_auth.CustomUser', on_delete = models.CASCADE)
	country = models.CharField(max_length=15)
	start_date = models.CharField(max_length = 15)
	duration = models.CharField(max_length = 15)
	accepted = models.BooleanField(default = False)
	language_knowledge = models.CharField(max_length = 2)
