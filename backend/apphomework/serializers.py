from rest_framework import serializers
from .models import *

class HomeworkDetailSerializer(serializers.ModelSerializer):   
    class Meta:
        model=Homework
        fields=[
        'idhomework',
        'fkcourse',
        'title'
        ]

class SubmitionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubmitions
        fields=[
        'idsubmition',
        'fkhomework',
        'media',
        'fkstudent',
        ]

class HwMediaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = HwMedia
        fields=[
        'idhwmedia',
        'fkhw',
        'media'
        ]

class HomeworkStudentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkStudent
        fields = [
        'idhwstudent',
        'fkstudent',
        'fkhw',
        'score',
        'feedback',
        'passed',
        'start',
        'deadline',
        ]