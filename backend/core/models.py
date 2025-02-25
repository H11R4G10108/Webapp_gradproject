# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = True` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser


class Post(models.Model):
    postid = models.BigAutoField(db_column='postID', primary_key=True)  # Field name made lowercase.
    p_date = models.DateTimeField()
    groupurl = models.CharField(db_column='groupURL', max_length=255, blank=True, null=True)  # Field name made lowercase.
    posturl = models.CharField(db_column='postURL', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    content = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    react_num = models.IntegerField(blank=True, null=True)
    cmt_num = models.IntegerField(blank=True, null=True)
    statusid = models.ForeignKey('Status', on_delete=models.CASCADE, db_column='statusID', blank=True, null=True)  # Field name made lowercase.
    replyid = models.ForeignKey('Reply', on_delete=models.CASCADE, help_text="Reply for the post", db_column='replyID', blank=True, null=True)  # Field name made lowercase.
    def __str__(self):
        return self.postid
    class Meta:
        db_table = 'post'

class Reply(models.Model):
    replyid = models.BigAutoField(db_column='replyID', primary_key=True)
    postid = models.ForeignKey(Post, on_delete=models.CASCADE)
    r_date = models.DateTimeField()
    reply = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.replyid
    class Meta:
        db_table = 'reply'



class Comment(models.Model):
    cmtid = models.BigAutoField(db_column='cmtID', primary_key=True)  # Field name made lowercase.
    post = models.ForeignKey(Post, on_delete=models.CASCADE, help_text="The post of the comment")  # Field name made lowercase.
    c_date = models.DateTimeField()
    content = models.TextField(blank=True, null=True)
    class Meta:
        db_table = 'comment'


class Status(models.Model):
    statusid = models.BigAutoField(db_column='statusID', primary_key=True)  # Field name made lowercase.
    status_desc = models.CharField(unique=True, max_length=20, blank=True, null=True)

    def __str__(self):
        return self.status_desc
    class Meta:
        db_table = 'status'


class User(AbstractUser):
    userid = models.BigAutoField(db_column='userID', primary_key=True, unique=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    first_name = None
    last_name = None
    groups = None
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]
    class Meta:
        db_table = 'user'
    def __str__(self):
        return self.username


class UserBookmarkPost(models.Model):
    markid = models.BigAutoField(db_column='markID', primary_key=True)  # Field name made lowercase.
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userID')  # Field name made lowercase.
    postid = models.ForeignKey(Post, on_delete=models.CASCADE)  # Field name made lowercase.
    class Meta:
        db_table = 'userbookmarkpost'
