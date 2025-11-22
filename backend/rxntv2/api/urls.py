from django.urls import path
from . import views

urlpatterns = [
    path('threads/', views.ThreadedView.as_view(), name='threaded-view'),
    path('comments/', views.CommentsView.as_view(), name='threaded-view'),
    path('user/<int:id>/', views.UserProfileView.as_view(), name='user profile'),
    path('create-post/', views.CreatePostView.as_view(), name='create-post'),
    path('delete-post/<int:pk>/', views.DeletePostView.as_view(), name='delete-post'),
    path('edit-post/<int:pk>/', views.EditPostView.as_view(), name='edit-post'),    
    path('create-comment/', views.CreateCommentView.as_view(), name='create-comment'),
    path('delete-comment/<int:pk>/', views.DeleteCommentView.as_view(), name='delete-comment'),
    path('edit-comment/<int:pk>/', views.EditCommentView.as_view(), name='edit-comment'),
]