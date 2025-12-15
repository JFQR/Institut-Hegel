from django.shortcuts import render
from rest_framework import generics
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
from rest_framework.permissions import AllowAny
from apphomework.models import Homework
from appcourse.models import Course, TeacherCourse
from custom_auth.models import CustomUser
from django.http import JsonResponse

#----------------CRUD for courses-----------------
#C
class CourseCreateAPIView(generics.CreateAPIView):
    queryset=Course.objects.all()
    serializer_class = CourseDetailSerializer
#R
class CourseListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer

class CourseDetailAPIView(generics.RetrieveAPIView):
    lookup_field = "idcourse" 
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
#U
class CourseRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idcourse"
    queryset = Course.objects.all()
    serializer_class=CourseDetailSerializer
#D
class CourseDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idcourse"
    queryset = TeacherCourse.objects.all()
    serializer_class = CourseDetailSerializer
#----------------CRUD for TeacherCourse-----------------
#C
class TeacherCourseCreateAPIView(generics.CreateAPIView):
    queryset=TeacherCourse.objects.all()
    serializer_class = TeacherCourseDetailSerializer
#R
class TeacherCourseListAPIView(generics.ListAPIView):
    queryset = TeacherCourse.objects.all()
    serializer_class = TeacherCourseDetailSerializer

class TeacherCourseDetailAPIView(generics.RetrieveAPIView):
    lookup_field = "idteachercourse" 
    queryset = TeacherCourse.objects.all()
    serializer_class = TeacherCourseDetailSerializer
#U
class TeacherCourseRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idteachercourse"
    queryset = TeacherCourse.objects.all()
    serializer_class=TeacherCourseDetailSerializer
#D
class TeacherCourseDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idteachercourse"
    queryset = TeacherCourse.objects.all()
    serializer_class = TeacherCourseDetailSerializer
#------------------------------profitiency level-------------------------
class CreateProfitiencyLevel(generics.CreateAPIView):
    queryset =  ProfitiencyLevel.objects.all()
    serializer_class = ProfitiencyLevelSerilizer
#------------------------------travel petitions---------------------------
class CreateTravelPetition(generics.CreateAPIView):
    queryset =  TravelPetition.objects.all()
    serializer_class = TravelPetitionSerilizer
#topics
class TopicsListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Topic.objects.all()
    serializer_class = TopicsDetailSerializer
#------------------------------personalized-------------------------------

def get_students_by_course(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    students = course.students.select_related('user').all()

    data = []
    for student in students:
        data.append({
            'id': student.id,
            'email': student.user.email,
            'name': student.user.name,
            'country': student.user.country,
            'age': student.user.age,
            'sex': student.user.sex,
        })

    return JsonResponse({'course': course.title, 'students': data})

def teacher_courses_with_homework(request, teacher_id):
    teacher_courses = TeacherCourse.objects.filter(fkteacher_id=teacher_id).select_related('fkcourse')

    data = []
    for tc in teacher_courses:
        course = tc.fkcourse
        homeworks = Homework.objects.filter(fkcourse=course)

        data.append({
            "course_id": course.idcourse,
            "course_title": course.title,
            "level": course.level,
            "homeworks": [
                {"id": hw.idhomework, "title": hw.title}
                for hw in homeworks
            ]
        })
    return JsonResponse(data, safe=False)
