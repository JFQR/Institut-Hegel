from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from appcourse.models import Course

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('User must have an e-mail')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    id_papers = models.FileField(upload_to='id_papers/')
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    age = models.IntegerField(default=15)
    sex = models.CharField(max_length=10)
    is_teacher = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)
    level = models.CharField(max_length=2, default="A1")#A1, A2,B1,B2...

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class TeacherProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher_profile')
    cv = models.FileField(upload_to='cvs/')
    german_certificate = models.FileField(upload_to='certificates/')
    bank_account = models.IntegerField()

    def __str__(self):
        return f"Teacher Profile of {self.user.email}"
        
#this will be filled by the head teacher, she will select in which course each student should be
class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    
    def __str__(self):
        return f"Student Profile of {self.user.email}"

