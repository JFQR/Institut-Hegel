from django.contrib import admin
from django.urls import path, include
from appcourse import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "appcourse"

urlpatterns = [
    path('course/<int:course_id>/students/', views.get_students_by_course, name='course_students'),
    path(
        'create-profitiency/<int:fk_id_participant>/<str:level>/', 
        views.CreateProfitiencyLevel.as_view(), name='create_profitiency'
    ),
    path(
        'create-profitiency/<int:fk_id_student>/', 
        views.CreateTravelPetition.as_view(), name='create_travel_petition'
    ),
    path('get-courses/',views.CourseListAPIView.as_view(), name = "all_courses"),
    path('get-topics/',views.TopicsListAPIView.as_view(), name = "all_topics"),
    path('get-courses-of-teacher/<int:teacher_id>/',views.teacher_courses_with_homework, name = "teacher-courses"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
