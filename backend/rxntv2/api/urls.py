from django.urls import path
from . import views

urlpatterns = [
    path('threads/', views.ThreadedView.as_view(), name='threaded-view'), # Ito ay for testing the feed, pero unfiltered. This will be for the admin
    path('comments/', views.CommentsView.as_view(), name='threaded-view'), # Same lng
    path('user/<int:id>/', views.UserProfileView.as_view(), name='user profile'), # Get all of the users, para din sa admin
    path('create-post/', views.CreatePostView.as_view(), name='create-post'), # For all users
    path('delete-post/<int:pk>/', views.DeletePostView.as_view(), name='delete-post'), # For all users
    path('edit-post/<int:pk>/', views.EditPostView.as_view(), name='edit-post'), # For all users
    path('create-comment/', views.CreateCommentView.as_view(), name='create-comment'), # For all users
    path('delete-comment/<int:pk>/', views.DeleteCommentView.as_view(), name='delete-comment'), # For all users
    path('edit-comment/<int:pk>/', views.EditCommentView.as_view(), name='edit-comment'), # For all users
    path('follow/user/<int:user_id>/', views.FollowUser.as_view(), name='follow'), # For all users
    path('unfollow/user/<int:user_id>/', views.Unfollow.as_view(), name='unfollow'), # For all users
    path('feed/', views.FilteredFeedView.as_view(), name='filtered-feed'), # This is filtered feed, for normal users. Not for admin.
    path('get/followers/<str:user_id>/', views.FollowerListView.as_view(), name='get-followers'),
    path('get/following/<str:user_id>/', views.FollowingListView.as_view(), name='get-followings'),
    path('dashboard/', views.DashboardVIew.as_view(), name='dashboard'), # endpoint for getting everything
    path('report/nonuser/', views.ReportNonUserView.as_view(), name='report-nonuser'),
    path('delete-non-user-report/<int:pk>/', views.DeleteReportNonUserView.as_view(), name='delete-report-non-user'),
    path('report/user/', views.ReportUserView.as_view(), name='report-user'),
    path('delete-user-report/<int:pk>/', views.DeleteReportUserView.as_view(), name='delete-user-report'),
    path('notification/send/', views.CreateNotificationView.as_view(), name='send-notification'),
    path('get/notifications/', views.NotificationView.as_view(), name='get-notification'),
    path('delete/notification/<int:pk>/', views.NotificationView.as_view(), name='delete-notification')
]