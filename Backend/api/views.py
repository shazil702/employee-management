import random
from .models import User, Employee
from .serializers import RegisterSerializer, UserSerializer, EmployeeSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from employee_management import settings
from rest_framework_simplejwt.tokens import AccessToken
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


# View for Registration
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# View for Sending OTP
class SendOtpView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            email = request.data['email']
            user = get_object_or_404(User, email=email)
            otp = str(random.randint(100000, 999999))
            subject = 'OTP for Changing Password'
            message = f'Your OTP is {otp}. Please use it to change your password.'
            from_email = settings.EMAIL_HOST_USER
            send_mail(subject, message, from_email, [email])
            token = AccessToken.for_user(user)
            token.set_exp(lifetime=timedelta(minutes=2))
            token['otp'] = otp
            token['email'] = email
            return Response({'otp_token': str(token)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# View for Forgot Password
class VerifyOtpView(APIView):
    def post(self, request, *args, **kwargs):
        otpToken = request.data['otp_token']
        userOTP = request.data['otp']
        try:
            token = AccessToken(otpToken)
            email = token['email']
            otp = token['otp']
            if otp == userOTP:
                password_token = AccessToken.for_user(User.objects.get(email=email))
                password_token.set_exp(lifetime=timedelta(minutes=2))
                password_token['email'] = email
                return Response({'password_token': str(password_token)}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# View for Changing Password
class PasswordChangeView(APIView):
    def post(self, request, *args, **kwargs):
        passwordToken = request.data['password_token']
        newPassword = request.data['new_password']
        confirmPassword = request.data['confirm_password']
        print(request.data)
        try:
            token = AccessToken(passwordToken)
            email = token['email']
            user = get_object_or_404(User, email=email)
            if newPassword == confirmPassword:
                user.set_password(newPassword)
                user.save()
                return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# view for Prfile View
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# View for adding and viewing Employees
class EmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            serializer = EmployeeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        try:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,id):
        try:
            employee = Employee.objects.get(id=id)
            employee.delete()
            return Response({"message": "Employee deleted successfully"}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# View for Searching Employees
class SearchView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            text = request.data['text']
            employees = Employee.objects.filter(Q(id__icontains=text) | Q(data__icontains=text))
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            