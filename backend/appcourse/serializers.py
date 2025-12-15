from rest_framework import serializers
from .models import *

class CourseDetailSerializer(serializers.ModelSerializer):   
    class Meta:
        model=Course
        fields=[
        'idcourse',
        'title',
        'level',
        'instructions',
        'description',
        ]

class TeacherCourseDetailSerializer(serializers.ModelSerializer):   
    class Meta:
        model=TeacherCourse
        fields=[
        'idteachercourse',
        'fkteacher',
        ]

class ProfitiencyLevelSerilizer(serializers.ModelSerializer):
    class Meta:
        model = ProfitiencyLevel
        fields = [
            'idprofitiency',
            'level',
            'fk_id_participant'
        ]

class TravelPetitionSerilizer(serializers.ModelSerializer):
    class Meta:
        model = TravelPetition
        fields = [
            'idpetition',
            'fk_id_student',
            'country',
            'start_date',
            'duration',
            'accepted',
            'language_knowledge',
        ]
class TopicsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = [
            'id_topic',
            'name',
            'fk_course',
        ]