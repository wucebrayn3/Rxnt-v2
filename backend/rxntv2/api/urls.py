from django.urls import path
from . import views

urlpatterns = [
    # ---- Threads & Comments ----
    path('threads/', views.ThreadedView.as_view(), name='threaded-view'),
    path('comments/', views.CommentsView.as_view(), name='comments'),
    path('user/<int:id>/', views.UserProfileView.as_view(), name='user-profile'),
    
    # ---- Posts ----
    path('create-post/', views.CreatePostView.as_view(), name='create-post'),
    path('delete-post/<int:pk>/', views.DeletePostView.as_view(), name='delete-post'),
    path('edit-post/<int:pk>/', views.EditPostView.as_view(), name='edit-post'),
    
    # ---- Comments ----
    path('create-comment/', views.CreateCommentView.as_view(), name='create-comment'),
    path('delete-comment/<int:pk>/', views.DeleteCommentView.as_view(), name='delete-comment'),
    path('edit-comment/<int:pk>/', views.EditCommentView.as_view(), name='edit-comment'),
    
    # ---- Follows ----
    path('follow/user/<int:user_id>/', views.FollowUser.as_view(), name='follow'),
    path('unfollow/user/<int:user_id>/', views.Unfollow.as_view(), name='unfollow'),
    
    # ---- Feed and Dashboard ----
    path('feed/', views.FilteredFeedView.as_view(), name='filtered-feed'),
    path('get/followers/<str:user_id>/', views.FollowerListView.as_view(), name='followers'),
    path('get/following/<str:user_id>/', views.FollowingListView.as_view(), name='following'),
    path('dashboard/', views.DashboardVIew.as_view(), name='dashboard'),
    path('filter/', views.username_restriction, name='filter'),
    
    # ============================
    #   REPORTING SYSTEM (NEW)
    # ============================

    # ---- Report Content (Posts/Comments) ----
    path("report/content/", views.ReportNonUserView.as_view()),
    path("report/content/<int:pk>/", views.ReportNonUserDetailView.as_view()),
    path("report/content/<int:pk>/appeal/", views.ReportNonUserAppealView.as_view()),
    path("report/content/<int:pk>/moderate/", views.ReportNonUserModerateView.as_view()),
    path("report/content/<int:pk>/delete/", views.DeleteReportNonUserView.as_view()),

    # ---- Report User ----
    path("report/user/", views.ReportUserView.as_view()),
    path("report/user/<int:pk>/", views.ReportUserDetailView.as_view()),
    path("report/user/<int:pk>/appeal/", views.ReportUserAppealView.as_view()),
    path("report/user/<int:pk>/moderate/", views.ReportUserModerateView.as_view()),
    path("report/user/<int:pk>/delete/", views.DeleteReportUserView.as_view()),
]
