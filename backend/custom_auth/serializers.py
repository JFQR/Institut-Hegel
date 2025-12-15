from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TeacherProfile, StudentProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['id'] = user.id
        token['name'] = user.name
        token['is_teacher'] = user.is_teacher

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        request = self.context.get('request')

        data['id'] = user.id
        data['email'] = user.email
        data['name'] = user.name
        data['is_teacher'] = user.is_teacher

        if request and user.photo:
            data['photo'] = request.build_absolute_uri(user.photo.url)
        else:
            data['photo'] = None

        return data

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = [ 'cv', 'bank_account','german_certificate']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    teacher_profile = TeacherProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'country',
            'id_papers',
            'photo',
            'age',
            'sex',
            'is_teacher',
            'is_accepted',
            'level',
            'password',
            'teacher_profile',
        ]
        extra_kwargs = {
            'id_papers': {'required': False},
            'photo': {'required': False},
        }

    def create(self, validated_data):
        teacher_data = validated_data.pop('teacher_profile', None)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.is_teacher and teacher_data:
            TeacherProfile.objects.create(user=user, **teacher_data)
        return user



class StudentProfileSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['course', 'course_name']
