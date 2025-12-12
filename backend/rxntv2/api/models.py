from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_pic = models.ImageField(null=True, blank=True, default='userprofile/default_user.png', upload_to='userprofile/')
    bio = models.TextField(max_length=100)

class Post(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(default=None, null=True, blank=True)
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
    edited_at = models.DateTimeField(default=None, null=True, blank=True)
    
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
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under review', 'Under review'),
        ('Resolved', 'Resolved'),
        ('Dismissed', 'Dismissed'),
    ]
    complainant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaint_sender') # who reported
    reported_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaint_receiver') # who owns reported content
    reported_object = models.CharField(max_length=15) # post or comment
    reported_id = models.IntegerField() # post/comment id
    content = models.TextField() # post/comment content
    title = models.CharField(max_length=50, blank=True, null=True, default="Untitled") # applicable for posts as comments have no title
    reason = models.TextField(max_length=255)
    report_date = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    admin_notes = models.TextField(blank=True, null=True)
    appeal_message = models.TextField(blank=True, null=True, max_length=100)
    resolved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='resolved_nonuser_reports')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f'Object type: {self.reported_object}, reported by: {self.complainant.username}'
    
class ReportUser(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under review', 'Under review'),
        ('Resolved', 'Resolved'),
        ('Dismissed', 'Dismissed'),
    ]
    complainant = models.ForeignKey(User, on_delete=models.CASCADE) # who reported
    reported_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_user') # who is being reported
    reason = models.TextField(max_length=255)
    reported_object = models.CharField(max_length=4, default='User')
    report_date = models.DateTimeField(auto_now_add=True)
    
    # updated additional fields to support our user appeal cases
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    admin_notes = models.TextField(blank=True, null=True)
    appeal_message = models.TextField(blank=True, null=True, max_length=100)
    resolved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='resolved_user_reports')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f'Reported user: {self.reported_user.username}'
    
class Notification(models.Model):
    recipients = models.ManyToManyField(User, related_name='notifications_received')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_sent')
    topic = models.CharField(max_length=50, default='Unnamed Notification')
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        recipient_names = ', '.join([u.username for u in self.recipients.all()[:3]])
        if self.recipients.count() > 3:
            recipient_names += f' +{self.recipients.count() - 3} more'
        return f'{self.sender.username} notified {recipient_names}'