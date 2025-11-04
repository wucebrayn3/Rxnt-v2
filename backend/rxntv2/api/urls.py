from django.urls import path
from . import views

urlpatterns = [
    path('threads/', views.ThreadedView.as_view(), name='threaded-view'),
    path('comments/', views.CommentsView.as_view(), name='threaded-view'),
    path('user/<int:id>/', views.UserProfileView.as_view(), name='user profile')
]