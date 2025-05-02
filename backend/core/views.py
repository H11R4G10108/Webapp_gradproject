from django.shortcuts import render
from django.views import generic
from django.contrib.auth import logout
from django.shortcuts import redirect
from core.models import Post
from django.contrib.admin.views.decorators import staff_member_required

def custom_logout_view(request):
    logout(request)
    return redirect('/admin/login/')


class IndexView(generic.TemplateView):
    template_name = 'index.html'

@staff_member_required
def custom_admin_index(request):
    total_posts = Post.objects.count()
    recent_posts = Post.objects.order_by('-created_at')[:5]

    context = {
        'total_posts': total_posts,
        'recent_posts': recent_posts,
    }
    return render(request, 'admin/index.html', context)