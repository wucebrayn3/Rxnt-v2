from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, CommentSerializer, PostSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post, Comment

# Create your views here.

#CBV for User Registration

class CreateUserView(generics.CreateAPIView): # will automatically handle createing a new user or new object
    queryset = User.objects.all() # the list of all the differet objects, to avoid duplication
    serializer_class = UserSerializer # tells what data is needed to accept to make a new user (username, password)
    permission_classes = [AllowAny]  # Allow anyone to access this view for registration
    
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
    
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        user = User.objects.get(id=id)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)