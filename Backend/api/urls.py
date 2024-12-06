from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('sendOTP/', views.SendOtpView.as_view(), name='sendOTP'),
    path('verifyOTP/', views.VerifyOtpView.as_view(), name='verifyOTP'),
    path('changePassword/', views.PasswordChangeView.as_view(), name='changePassword'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('employee/', views.EmployeeView.as_view(), name='employee'),
    path('employee/<id>/', views.EmployeeView.as_view(), name='employee'),
    path('search/', views.SearchView.as_view(), name='search'),
]