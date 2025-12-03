from django.contrib.auth.models import User
from .models import Comment, Post, Follow, ReportNonUser, ReportUser, Notification
from rest_framework import serializers
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_staff = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'followers_count', 'following_count', 'is_following', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}} # Ensure password is write-only and will not be returned in responses
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        print(validated_data)
        return user
    
    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return Follow.objects.filter(follower=request.user, following=obj).exists()
    
    def get_is_staff(self, obj):
        return obj.is_staff
    
class PostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author', 'comments']
        extra_kwargs = {'author': {'read_only': True}}
        
    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data
    
    # def update(self, instance, validated_data):
    #     return super().update(instance, validated_data)
    
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
        fields = ['id', 'username', 'posts', 'comments', 'is_staff'] # need to add 'comments' field
        
    def get_posts(self, obj):
        user_post = Post.objects.filter(author=obj)
        # print(f"Obj value: {obj}\n{PostSerializer(Post.objects.filter(author=obj), many=True).data}")
        print(CommentSerializer(Comment.objects.filter(author=obj))) # this gets all the comments owned by current user
        return PostSerializer(user_post, many=True).data
    
    def get_comments(self, obj):
        user_comment = Comment.objects.filter(author=obj)
        return CommentSerializer(user_comment, many=True).data
    
class ReportNonUserSerializer(serializers.ModelSerializer):
    complainant = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ReportNonUser
        fields = ['id', 'complainant', 'reported_author', 'reported_object', 'reported_id', 'content', 'title', 'reason', 'report_date']
    
class ReportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportUser
        fields = ['id', 'complainant', 'reason', 'report_date', 'reported_author', 'reported_object']
        read_only_fields = ['complainant', 'reported_object']
        
class NotificationSerializer(serializers.ModelSerializer):
    # recipient = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = ['id',  'recipient',  'sender', 'topic' , 'content', 'created_at', 'is_read']
        read_only_fields = ['sender', 'created_at']
    # def get_recipient(self, obj):
    #     user = User.objects.filter(id=obj)
    #     print(f"yano {obj}")
    #     print(f"entire model: {Notification.objects.values().all()}")
    #     return UserSerializer(user).data
    # def update(self, instance, validated_data):
    #     return super().update(instance, validated_data)