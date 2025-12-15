from django.urls import path
from custom_auth import views
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    #to make login. Gives access and refresh:
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('detail/<int:id>/', UserDetailView.as_view(), name='detail'),#to get one user only
    #path('allusers/', UserListView.as_view(), name='detail'),
    path('update/', UpdateUserAndRefreshTokenView.as_view(), name = 'update'),
    path('delete/', DeleteAccountView.as_view(), name = 'delete'),
    path('logout/', LogoutView.as_view(), name = 'logout'),
    path('all_users/', UserListView.as_view(), name = 'all_users'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path('get-students-of-course/<int:course_id>/', views.get_students_of_course, name='students-of-course'),

]
