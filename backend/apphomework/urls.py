from django.contrib import admin
from django.urls import path, include
from apphomework import views
from django.conf import settings
from django.conf.urls.static import static
from apphomework import views

app_name="apphomework"

urlpatterns = [

    path('create/homework/', views.HomeworkCreateAPIView.as_view()),
    path('all/homework/', views.HomeworkListAPIView.as_view()),
    path('detail/homework/<int:idhomework>/', views.HomeworkDetailAPIView.as_view()),
    path('update/homework/<int:idhomework>/', views.HomeworkRetrieveUpdateAPIView.as_view()),
    path('delete/homework/<int:idhomework>/', views.HomeworkDeleteAPIView.as_view()),

    path('create/submition/', views.SubmitionCreateAPIView.as_view()),
    path('all/submition/', views.SubmitionListAPIView.as_view()),
    path('detail/submition/<int:idsubmition>/', views.SubmitionDetailAPIView.as_view()),
    path('update/submition/<int:idsubmition>/', views.SubmitionRetrieveUpdateAPIView.as_view()),
    path('delete/submition/<int:idsubmition>/', views.SubmitionDeleteAPIView.as_view()),

    path('create/hwstudent/', views.HomeworkStudentCreateAPIView.as_view()),
    path('all/hwstudent/', views.HomeworkStudentListAPIView.as_view()),
    path('detail/hwstudent/<int:idhwstudent>/', views.HomeworkStudentDetailAPIView.as_view()),
    path('update/hwstudent/<int:idhwstudent>/', views.HomeworkStudentRetrieveUpdateAPIView.as_view()),
    path('delete/hwstudent/<int:idhwstudent>/', views.HomeworkStudentDeleteAPIView.as_view()),

    path('create/hwmedia/', views.HwMediaCreateAPIView.as_view()),
    path('all/hwmedia/', views.HwMediaListAPIView.as_view()),
    path('detail/hwmedia/<int:idhomeworkmedia>/', views.HwMediaDetailAPIView.as_view()),
    path('detail/hwmedia-by-hw/<int:fkhw>/', views.HwMediaByHwAPIView.as_view()),
    path('update/hwmedia/<int:idhomeworkmedia>/', views.HwMediaRetrieveUpdateAPIView.as_view()),
    path('delete/hwmedia/<int:idhomeworkmedia>/', views.HwMediaDeleteAPIView.as_view()),

    path('courses/<int:course_id>/homeworks/', views.HomeworkByCourseView.as_view(), name='course-homeworks'),
    path('submissions/<int:student_id>/<int:homework_id>/', views.SubmitionListAPIView.as_view(), name='submission-list'),

    path('student-lsit-homework/<int:fkstudent>/',views.student_homework, name='list-hw-student'),
    path('student-media-to-score/<int:fkstudent>/<int:fkhomework>/',views.homework_list_by_student, name='media-to-score'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)