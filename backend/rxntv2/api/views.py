from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, CommentSerializer, PostSerializer, UserProfileSerializer, ReportNonUserSerializer, ReportUserSerializer, NotificationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Post, Comment, Follow, ReportNonUser, ReportUser, Notification

# Create your views here.

#CBV for User Registration

class CreateUserView(generics.CreateAPIView): # will automatically handle createing a new user or new object
    queryset = User.objects.all() # the list of all the differet objects, to avoid duplication
    serializer_class = UserSerializer # tells what data is needed to accept to make a new user (username, password)
    permission_classes = [AllowAny]  # Allow anyone to access this view for registration
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logoutView(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out'})
    except Exception as e:
        return Response({'error': f'{e}, invalid token'})
    
class CommentsView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    
class ThreadedView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    # def get_queryset(self):
    #     return User.objects.exclude(id=self.request.user.id)
    
class ExcludedUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        user = User.objects.get(id=id)
        print(f'Narito ako: {user} - {id}')
        print(f'Userprofileview user: {self.request.user}')
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
class UserCommentView(APIView): # Posts with user's comments will apear in profile view.
    permission_classes = [IsAuthenticated]
    
    def get():
        return
    
class CreatePostView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
    def perform_create(self, serializer):
        # serializer is already validated by the view before perform_create is called
        serializer.save(author=self.request.user)
        print(self.request.user)
            
class CreateCommentView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        print(f'{self.request.user} commented')
        return Comment.objects.filter(author=user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        print(f'{self.request.user} commented')
            
class DeletePostView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
class EditPostView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
    def perform_update(self, serializer):
        print(f'Edit stat: {serializer}\nEdit info: {self.request.user}')
        serializer.save()
        return f'Post updated by {self.request.user}'
    
class EditCommentView(generics.UpdateAPIView):
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(author=user)
    
    def perform_update(self, serializer):
        serializer.save()
        return 'Naedit na'

class DeleteCommentView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(author=user)
    
class FollowUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, user_id):
        target = get_object_or_404(User, id=user_id)
        
        if request.user == target:
            return Response({'error': "You can't follow yourself"}, status=400)
        
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=target,
        )
        
        if created:
            return Response({'message':'Followed'})
        
        return Response({'message':"Already following"})
    
class Unfollow(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(selt, request, user_id):
        target = get_object_or_404(
            User,
            id=user_id,
        )
        
        Follow.objects.filter(
            follower=request.user,
            following=target
        ).delete()
        
        return Response({'message':'Unfollowed'})
    
class FollowerListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, user_id):
        target = User.objects.get(username=user_id)
        followers = target.followers.all()
        users = [i.follower for i in followers]
        return Response(UserSerializer(users, many=True).data)
    
class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, user_id):
        target = User.objects.get(username=user_id)
        following = target.following.all()
        users = [i.following for i in following]
        return Response(UserSerializer(users, many=True).data)
    
class FilteredFeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        following_ids = user.following.values_list('following', flat=True)
        return Post.objects.filter(author__in=following_ids).order_by('-created_at')
    
class DashboardVIew(APIView): # will get everything
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]   
    
    def get_users(self):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return serializer.data
    
    def get_posts(self):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return serializer.data
    
    def get_comments(self):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data
    
    def get_non_user_reports(self):
        reports = ReportNonUser.objects.all()
        serializer = ReportNonUserSerializer(reports, many=True)
        return serializer.data
    
    def get(self, request):
        return Response({
            'users': self.get_users(),
            'posts': self.get_posts(),
            'comments': self.get_comments(),
            'non_user_reports': self.get_non_user_reports(),
        })
        
class ReportNonUserView(generics.CreateAPIView):
    queryset = ReportNonUser.objects.all()
    serializer_class = ReportNonUserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def perform_create(self, serializer):
        serializer.save(complainant=self.request.user)
        
class DeleteReportNonUserView(generics.DestroyAPIView):
    queryset = ReportNonUser.objects.all()
    serializer_class = ReportNonUserSerializer
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ReportNonUser.objects.all()
        return ReportNonUser.objects.none()
    
class ReportUserView(generics.CreateAPIView):
    queryset = ReportUser.objects.all()
    serializer_class = ReportUserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
class DeleteReportUserView(generics.DestroyAPIView):
    queryset = ReportUser.objects.all()
    serializer_class = ReportUserSerializer
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ReportUser.objects.all()
        return ReportUser.objects.none()
    
class NotificationView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        print(f"hala {self.request.user.id}")
        return Notification.objects.all()
        # return Notification.objects.filter(recipient=self.request.user.id)
        
class CreateNotificationView(generics.CreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save()

class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # Pansariling notifs lng
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer): # Staff lng makakagawa ng notif
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can create notifications.")
        serializer.save()

    def perform_destroy(self, instance): # Yung may-ari lng ng notif makakapag-delete
        if instance.recipient != self.request.user:
            raise PermissionDenied("You cannot delete this notification.")
        instance.delete()
