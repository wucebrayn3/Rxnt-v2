from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
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

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
# class BanUserView(APIView):
#     permission_classes = [IsAdminUser]
    
#     def post(self, request, pk):
#         try:
#             user = User.objects.get(pk=pk)
#         except User.DoesNotExist:
#             return Response({'message': 'User not found'}, status=404)
        
#         user.is_active = False
#         user.save()            
    
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
        post = serializer.save(author=self.request.user)
        print(f'bwesit: {post}')
        print(f'etits: {self.request.user}')
        send_notification_to_followers(sender=self.request.user, topic='New post', content=f"{self.request.user}'s new post")
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
        comment = serializer.save(author=self.request.user)

        sender = self.request.user
        post_author = comment.post.author

        if comment.parent:
            parent_author = comment.parent.author

            if parent_author != sender:
                notif = Notification.objects.create(
                    sender=sender,
                    topic="New reply",
                    content=f"{sender.username} replied to your comment"
                )
                notif.recipients.add(parent_author)

            if post_author != sender and post_author != parent_author:
                notif_post = Notification.objects.create(
                    sender=sender,
                    topic="New reply on your post",
                    content=f"{sender.username} replied to a comment on your post"
                )
                notif_post.recipients.add(post_author)

        else:
            if post_author != sender:
                notif = Notification.objects.create(
                    sender=sender,
                    topic="New comment",
                    content=f"{sender.username} commented on your post"
                )
                notif.recipients.add(post_author)
                
class DeletePostView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
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
        if not self.request.user.is_staff:
            user = self.request.user
            return Comment.objects.filter(author=user)
        return Comment.objects.all()
    
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
            notification = Notification.objects.create(sender=request.user, topic='New follower', content=f'{request.user.username} followed you')
            notification.recipients.add(target)
        
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
    
    def get_user_reports(self):
        reports = ReportUser.objects.all()
        serializer = ReportUserSerializer(reports, many=True)
        return serializer.data
    
    def get(self, request):
        return Response({
            'users': self.get_users(),
            'posts': self.get_posts(),
            'comments': self.get_comments(),
            'non_user_reports': self.get_non_user_reports(),
            'user_reports': self.get_user_reports(),
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
    
    def perform_create(self, serializer):
        serializer.save(complainant=self.request.user)
    
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
        return Notification.objects.filter(recipients=self.request.user)
        
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

    def get_queryset(self):
        return Notification.objects.filter(recipients=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def perform_destroy(self, instance):
        if self.request.user != instance.sender and not self.request.user.is_staff:
            raise PermissionDenied("You cannot delete this notification.")
        instance.delete()

    def perform_update(self, serializer):
        notification = serializer.instance
        user = self.request.user

        if user in notification.recipients.all():
            serializer.save()
            return

        if user == notification.sender or user.is_staff:
            serializer.save()
            return

        raise PermissionDenied("You cannot update this notification.")

def send_notification_to_followers(sender, topic, content):
    followers = User.objects.filter(following__following=sender).exclude(id=sender.id)
    print(f'lentek: {followers}')
    if not followers.exists():
        return None
    
    notification = Notification.objects.create(
        sender=sender,
        topic=topic,
        content=content
    )
    notification.recipients.set(followers)
    return notification
        
BANNED_WORDS = [
    'shit', 'sheet', 'shiet', 'shyt', 'sh1t', '8h1t', '8hit',
    'fuck', 'fucker', 'fck', 'fvck', 'fucc', 'fuk',
    'dick', 'd1ck', 'dck', 'dicc', 'd1c', 'dik', 'dikc',
    'suck', 'svck', 'sck', 'succ', 'suc', 'suk', 'sukk',
    'zuck', 'zvck', 'zck', 'zucc', 'zuc', 'zuk', 'zukk',
    'penis', 'p3nis', 'pen1s', 'p3n1s', 'peenar', 'p33nar', 'peen4r',
    'peniz', 'p3niz', 'pen1z', 'p3n1z',
    'pussy', 'pvssy', 'pu88y', 'pv88y', 'pussie', 'pussi', 'poosie', 'poosi',
    'vagina', 'v4gina', 'vagin4', 'vag1na', 'v4g1na', 'v4g1n4',
    'bagina', 'b4gina', 'bagin4', 'bag1na', 'b4g1na', 'b4g1n4',
    'vajina', 'v4jina', 'vajin4', 'vaj1na', 'v4j1na', 'v4j1n4',
    'bajina', 'b4jina', 'bajin4', 'baj1na', 'b4j1na', 'b4j1n4',
    'fag', 'faggot', 'fagg', 'f4g', 'f4gg', 'f4ggot', 'fagg0t', 'fagot', 'f4got', 'fag0t', 'f4g0t', 'f4gg0t'
    'charlie kirk',
    'nigga', 'niga', 'ni66a', 'ni6a', 'nigg4', 'nig4', 'n1gga', 'n1ga', 'n16ga', 'n166a', 'n1664', 'ni664', 'nig6a'
    'weed',
    'drug',
    'ass', 'a88',
    'asshole','ahole', 'assh0le', 'asshol3', 'assh0l3',
    'panty',
    'sniffer',
    'sex', '8ex', '83x', 's3x', 
    'kill', 'k1ll', 'ki11', 'kys', 'kllyrslf', 'kllme', 'killme', 'killm3', 'kllm3', 'killurself'
    # 'blow', 'bl0w', 'blovv', 'bl0vv',
    'anus', '4nus',
    'tits', 'tit', 'titty', 'tittie', 'tiddie', 'titties', 'tiddies',
    'feet', 'foot',
    'lick', 'l1ck',
    'boobs', 'b00bs', 'b00b8', 'boobie', 'boobies', "booby", 'b00by', 'b00bies', '8oo8s',
    'gangbang', 'g4ngb4ng', 'gangb4ng', 'g4ngbang', '6angbang', '64n6b4n6', '6an6ban6',
    'rape', 'r4pe', 'rap3', 'r4p3',
    'cum',
    'semen', 'seemen', 'seamen', 'cmen',
    'wank', 'w4nk', 'wanker', 'w4nker', 'w4nk3r', 'wank3r',
    'cock',
    'snuff', 'gore', 'gor3',
    'suicide', 'selfharm', 'suxcxde',
    'kxll', 'rxpe', 'fxck', 'shxt', 'dxck', 'murder', 'mxrdxr', 'rapx', 'mxrder', 'murdxr',
    'slut', 'slxt', '8lut',
    'sixnine', '69', 'sixtynine',
    '666', 'sixsixsix', '6sixsix', 'six6six', 'sixsix6', '6six6', '66six', 'six66',
    'whore', 'whxrx', 'whxre', 'whorx', 'wh0re', 'wh0r3', 'whor3', 'hoe', 'h0e', 'h03', 'ho3',
    'busty',
    'lewd', 'l3wd', 
    'nude', 'nudes', 'nood', 'noods', 'nud3', 'nud3s', 'newd', 'newds',
    'hitler', 'h1tler', 'h1tl3r', 'hitl3r',
    'niggler', 'nigglet', 
    'jigaboo', 'j1gaboo', 'j1gab00',
    'beggar', 'homeless',
    'gay', 'g4y',
    'retard',
    'downsyndrome', 'downy', 'downie', 'downsyndrom3', 'downsyndr0me', 'downsyndr0m3', 'd0wnsyndrome', 'd0wnsyndr0me', 'd0wnsyndr0m3',
    'porn',
    'downsyndrome',
    'hentai',
    'futanari',
    'kinky',
    'idiot',
    'sperm',
    'enema',
    'pedophile',
    'necrophile',
    'negro',
    'femboy',
    'lesbian',
    'twink',
    'necrophilia',
    'dink',
    'clitoris', 'clit', 'clits', 'cl1toris', 'clit0ris', 'clitor1s', 'cl1t0r1s',    
    'dead', 'die', 'death',
    'reaper',
    'trans', 'trany', 'tranie', 'transgender',
    'feed', 'f33d',
    'vore', 'vor3', 'v0r3', 'v0r3',
    'feces', 'fecal', 'f3c3s', 'f3cal',
    'hate', 'h4te', 'hat3', 'h4t3',
    'hell', 'h3ll',
    'satan', 's4t4n', 's4tan', 'sat4n',
    'devil', 'd3vil', 'dev1l', 'd3v1l',
    'evil', '3vil', 'ev1l', '3v1l',
    'wench', 'w3nch',
    'witch', 'w1tch',
    'brief',
    'armpit', '4rmpit', 'armp1t', '4rmp1t',
    'coochie', 'cooch', 'coochee',
    'slurp', 
    'mommy', 'daddy',
    'criminal',
    'poop', 'p00p', 'p0op', 'po0p',
    'urine', 'pee', 'p33',
    'creampie', 'cr3ampi3', 'cre4mpie', 'creamp1e', 'cr3amp1e',
    'PWD',
    'slayer',
]  
        
def profanity_pipeline(target: str) -> bool:
    if not target:
        return False  


    if not target.isalnum():
        return True  # reject immediately

    text = target.lower().strip()

    normalized = []
    for char in text:
        if not normalized or char != normalized[-1]:
            normalized.append(char)

    clean = "".join(normalized)

    for word in BANNED_WORDS:
        if word in clean:
            return True  # PROFANE

    return False  # CLEAN

@api_view(['POST'])
@permission_classes([AllowAny])
def username_restriction(request):
    username = request.data.get("username", "")

    is_profane = profanity_pipeline(username)

    if is_profane:
        return Response({
            "allowed": False,
            "message": "Username contains prohibited content."
        }, status=400)

    return Response({
        "allowed": True
    })