from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status

from appcourse import models

#----------------CRUD for Homework-----------------
#C
class HomeworkCreateAPIView(generics.CreateAPIView):
    queryset=Homework.objects.all()
    serializer_class = HomeworkDetailSerializer
#R
class HomeworkListAPIView(generics.ListAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkDetailSerializer

class HomeworkDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    lookup_field = "idhomework" 
    queryset = Homework.objects.all()
    serializer_class = HomeworkDetailSerializer
#U
class HomeworkRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idhomework"
    queryset = Homework.objects.all()
    serializer_class=HomeworkDetailSerializer
#D
class HomeworkDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idhomework"
    queryset = Homework.objects.all()
    serializer_class = HomeworkDetailSerializer
#----------------CRUD for Submition-----------------
#C
class SubmitionCreateAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset=StudentSubmitions.objects.all()
    serializer_class = SubmitionDetailSerializer
#R
class SubmitionDetailAPIView(generics.RetrieveAPIView):
    lookup_field = "idsubmition" 
    queryset = StudentSubmitions.objects.all()
    serializer_class =SubmitionDetailSerializer
#U
class SubmitionRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idsubmition"
    queryset = StudentSubmitions.objects.all()
    serializer_class=SubmitionDetailSerializer
#D
class SubmitionDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idsubmition"
    queryset = StudentSubmitions.objects.all()
    serializer_class = SubmitionDetailSerializer
#----------------CRUD for Homework-----------------
#C
class HomeworkStudentCreateAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset=HomeworkStudent.objects.all()
    serializer_class = HomeworkStudentDetailSerializer
#R
class HomeworkStudentListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = HomeworkStudent.objects.all()
    serializer_class = HomeworkStudentDetailSerializer

class HomeworkStudentDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    lookup_field = "idhwstudent" 
    queryset = HomeworkStudent.objects.all()
    serializer_class =HomeworkStudentDetailSerializer
#U
class HomeworkStudentRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    lookup_field="idhwstudent"
    queryset = HomeworkStudent.objects.all()
    serializer_class=HomeworkStudentDetailSerializer
#D
class HomeworkStudentDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idhomeworkstudent"
    queryset = HomeworkStudent.objects.all()
    serializer_class = HomeworkStudentDetailSerializer
#-------------------------CRUD hwmedia--------------------------------
class HwMediaCreateAPIView(generics.CreateAPIView):
    queryset=HwMedia.objects.all()
    serializer_class = HwMediaDetailSerializer
#R
class HwMediaListAPIView(generics.ListAPIView):
    queryset = HwMedia.objects.all()
    serializer_class = HwMediaDetailSerializer

class HwMediaDetailAPIView(generics.RetrieveAPIView):
    lookup_field = "idhwmedia" 
    queryset = HwMedia.objects.all()
    serializer_class =HwMediaDetailSerializer

class HwMediaByHwAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = HwMediaDetailSerializer

    def get_queryset(self):
        fkhw = self.kwargs.get('fkhw')
        return HwMedia.objects.filter(fkhw_id=fkhw)
#U
class HwMediaRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idhwmedia"
    queryset = HwMedia.objects.all()
    serializer_class=HwMediaDetailSerializer
#D
class HwMediaDeleteAPIView(generics.DestroyAPIView):
    lookup_filed = "idhwmedia"
    queryset = HwMedia.objects.all()
    serializer_class = HwMediaDetailSerializer
#------------------------personalized------------------------------
class SubmitionListAPIView(generics.ListAPIView):
    serializer_class = SubmitionDetailSerializer

    def get_queryset(self):
        student_id = self.kwargs.get('student_id')
        homework_id = self.kwargs.get('homework_id')
        return StudentSubmitions.objects.filter(fkstudent__id=student_id, fkhomework__id=homework_id)

class HomeworkByCourseView(generics.ListAPIView):
    serializer_class = HomeworkDetailSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Homework.objects.filter(fkcourse_id=course_id)

@api_view(['GET'])
@permission_classes([AllowAny])
def student_homework(request, fkstudent):
    tareas = HomeworkStudent.objects.filter(fkstudent_id=fkstudent).values(
            'idhwstudent',       
            'fkhw__idhomework',    
            'fkhw__title',        
        )

    return Response({'student_id': fkstudent, 'hw': list(tareas)})

@api_view(['GET'])
@permission_classes([AllowAny])
def homework_list_by_student(request, fkstudent, fkhomework):
    submitions = StudentSubmitions.objects.filter(
        fkhomework_id=fkhomework,
        fkstudent_id=fkstudent
    )

    hw_student = HomeworkStudent.objects.filter(
        fkstudent_id=fkstudent,
        fkhw_id=fkhomework
    ).first()

    if not submitions.exists() and not hw_student:
        return Response({'error': 'No se encontraron registros'}, status=status.HTTP_404_NOT_FOUND)

    submition_serializer = SubmitionDetailSerializer(submitions, many=True)
    hwstudent_data = None

    if hw_student:
        hwstudent_data = HomeworkStudentDetailSerializer(hw_student).data

    return Response({
        'homework_student': hwstudent_data,
        'submitions': submition_serializer.data
    }, status=status.HTTP_200_OK)


