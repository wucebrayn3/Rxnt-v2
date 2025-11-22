from django.contrib.auth.models import User
from .models import Comment, Post
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}} # Ensure password is write-only and will not be returned in responses
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        print(validated_data)
        return user
    
class PostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author', 'comments']
        extra_kwargs = {'author': {'read_only': True}}
        
    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data
    
class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'parent', 'post', 'replies']
        
    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data
    
class UserProfileSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'posts', 'comments'] # need to add 'comments' field
        
    def get_posts(self, obj):
        user_post = Post.objects.filter(author=obj)
        # print(f"Obj value: {obj}\n{PostSerializer(Post.objects.filter(author=obj), many=True).data}")
        print(CommentSerializer(Comment.objects.filter(author=obj))) # this gets all the comments owned by current user
        return PostSerializer(user_post, many=True).data
    
    def get_comments(self, obj):
        user_comment = Comment.objects.filter(author=obj)
        return CommentSerializer(user_comment, many=True).data
    