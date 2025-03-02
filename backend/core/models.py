# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = True` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost:5173/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink)+str("password-reset/")+str(token)

    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_adress': reset_password_token.user.email
    }

    html_message = render_to_string("email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject = "Request for resetting password for {title}".format(title=reset_password_token.user.email),
        body=plain_message,
        from_email = "sender@example.com",
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()
class Post(models.Model):
    postid = models.BigAutoField(db_column='postID', primary_key=True)
    p_date = models.DateTimeField()
    groupurl = models.CharField(db_column='groupURL', max_length=255, blank=True, null=True)  # Field name made lowercase.
    posturl = models.CharField(db_column='postURL', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    content = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    react_num = models.IntegerField(blank=True, null=True)
    cmt_num = models.IntegerField(blank=True, null=True)
    statusid = models.ForeignKey('Status', on_delete=models.CASCADE, db_column='statusID', blank=True, null=True)  # Field name made lowercase.
    reply = models.TextField(blank=True, null=True)
    r_date = models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return self.postid
    class Meta:
        db_table = 'post'



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
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
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
