from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from .models import *
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import ListAPIView
from django.http import JsonResponse

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user, context={'request': request}).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=201)
        return Response(serializer.errors, status=400)

class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            if user.is_teacher:

                teacher_info = TeacherProfile.objects.get(user_id=id)
                data = {
                    'name': user.name,
                    'email': user.email,
                    'country':user.country,
                    'age':user.age,
                    'sex':user.sex,
                    'bank_account':teacher_info.bank_account,
                    'id':user.id_papers.name,
                    'photo': request.build_absolute_uri(user.photo.url) if user.photo else None,
                    'cv': teacher_info.cv.name,
                    'german_certificate':teacher_info.german_certificate.name,
                }
                return Response(data)
            else:
                data = {
                    'name': user.name,
                    'email': user.email,
                    'country':user.country,
                    'age':user.age,
                    'sex':user.sex,
                    'photo': request.build_absolute_uri(user.photo.url) if user.photo else None,
                    'id':user.id_papers.name
                }
                return Response(data)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)


class UpdateUserAndRefreshTokenView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user
        data = request.data

        user.name = data.get('name', user.name)
        user.level = data.get('level', user.level)
        user.country = data.get('country', user.country)
        user.sex = data.get('sex', user.sex)
        user.age = data.get('age', user.age)

        if 'photo' in data:
            user.photo = data['photo']

        if 'password' in data:
            user.set_password(data['password'])

        user.save()

        token = MyTokenObtainPairSerializer.get_token(user)
        return Response({
            'refresh': str(token),
            'access': str(token.access_token),
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'photo': request.build_absolute_uri(user.photo.url) if user.photo else None,
        })


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'Account deleted successfully'})

class SeeUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'photo': request.build_absolute_uri(user.photo.url) if user.photo else None,
        })

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#personalized
def get_students_of_course(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return JsonResponse({'error': 'Course not found'}, status=404)

    students = course.students.select_related('user').all()

    student_data = [
        {
            'id': s.user.id,
            'name': s.user.username,
            'email': s.user.email
        }
        for s in students
    ]

    return JsonResponse({'course': course.title, 'students': student_data})