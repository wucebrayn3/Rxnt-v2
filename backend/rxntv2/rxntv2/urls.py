"""
URL configuration for rxntv2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserListView, ProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # pre-built views for obtaining and refreshing tokens

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/me/', ProfileView.as_view(), name='profile-view'),
    path('api/user/register/', CreateUserView.as_view(), name='user-register'), # endpoint for user registration
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),  # Include other API URLs
    path('app/', include('api.urls')),  # Include other API URLs
    path('users/', UserListView.as_view(), name='user-list'),  # Endpoint to list users
]
