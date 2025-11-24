from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name='replies'
    )
    author = models.ForeignKey(User, 
                               on_delete=models.CASCADE, 
                               null=True, 
                               blank=True
                            )
    title = models.CharField(max_length=100, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.author} - {self.content[:20]}'
    
class Follow(models.Model):
    follower = models.ForeignKey(
        User,
        related_name='following',
        on_delete=models.CASCADE
    )
    following = models.ForeignKey(
        User,
        related_name='followers',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        
    def __str__(self):
        return f'{self.follower.username} followed {self.following.username}'
    
class ReportNonUser(models.Model):
    complainant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaint_sender') # who reported
    reported_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaint_receiver') # who owns reported content
    reported_object = models.CharField(max_length=15) # post or comment
    reported_id = models.IntegerField() # post/comment id
    content = models.TextField() # post/comment content
    title = models.CharField(max_length=100, blank=True, null=True) # applicable for posts as comments have no title
    reason = models.TextField(max_length=255)
    report_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Object type: {self.reported_object}, reported by: {self.complainant.username}'
    
class ReportUser(models.Model):
    complainant = models.ForeignKey(User, on_delete=models.CASCADE) # who reported
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_user') # who is being reported
    reason = models.TextField(max_length=255)
    report_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Reported user: {self.reported_user.username}'