from django.db import models
from appcourse.models import Course
from custom_auth.models import CustomUser

class Homework(models.Model):
	idhomework = models.AutoField(primary_key = True)
	fkcourse = models.ForeignKey(Course, on_delete = models.CASCADE)
	title= models.CharField(max_length = 50)

class HwMedia(models.Model):
	idhwmedia = models.AutoField(primary_key = True)
	fkhw = models.ForeignKey(Homework, on_delete= models.CASCADE,null=True, blank = True)
	media = models.FileField(upload_to='hwmedia/')

"""
esta tabla sirve solo cuando el maestro haya asignado la tarea, 
la tabla homework son las tareas predefinidas por la institución.
Acá solo se agarran las tareas predefinidas y se le asigna a c/alumno
con la información de entrega y el material que el alumno 
necesita:
"""

class HomeworkStudent(models.Model):
	idhwstudent = models.AutoField(primary_key = True)
	fkstudent = models.ForeignKey(CustomUser, on_delete	= models.CASCADE,null=True, blank = True)
	fkhw = models.ForeignKey(Homework, on_delete = models.CASCADE)
	score = models.IntegerField(null=True, blank = True)
	feedback = models.CharField(max_length = 500,null=True, blank = True)
	passed = models.BooleanField(default=False)
	start = models.DateField(null=True, blank = True)
	deadline = models.DateField(null=True, blank = True)

class StudentSubmitions(models.Model):
	idsubmition = models.AutoField(primary_key = True)
	fkhomework = models.ForeignKey(Homework, on_delete=models.CASCADE,null=True, blank = True)
	media = models.FileField(upload_to='sumitions/',null=True, blank = True)	
	fkstudent = models.ForeignKey(CustomUser, on_delete = models.CASCADE,null=True, blank = True)
