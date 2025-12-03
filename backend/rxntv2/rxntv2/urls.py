
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserListView, ProfileView, ExcludedUserListView,logoutView, NotificationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # pre-built views for obtaining and refreshing tokens
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('logout/', logoutView, name='logout'),
    path('api/me/', ProfileView.as_view(), name='profile-view'),
    path('api/user/register/', CreateUserView.as_view(), name='user-register'), # endpoint for user registration
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),  # Include other API URLs
    path('app/', include('api.urls')),  # Include other API URLs
    path('users/', UserListView.as_view(), name='user-list'),  # Endpoint to list users
    path('discover/', ExcludedUserListView.as_view(), name='user-list'),  # Endpoint to list users
    
    # bwisit 'to
    path('app/', include(router.urls)),
]
