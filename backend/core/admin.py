from django.contrib.admin.sites import site
from django.db.models import Count, Avg
from django.shortcuts import render
from .models import User, Post, UserBookmarkPost
from django.contrib import admin
admin.site.register(User)
admin.site.register(UserBookmarkPost)


def dashboard_view(request):
    # Get total post count
    total_posts = Post.objects.count()
    total_users = User.objects.count()

    # Get post count by district
    posts_by_district = list(Post.objects.values('district')
                         .annotate(count=Count('district'))
                         .exclude(district__isnull=True)
                         .exclude(district='')
                         .order_by('-count'))

    # Get average rent price by district
    avg_price_by_district = list(Post.objects.values('district')
                             .annotate(avg_price=Avg('price'))
                             .exclude(district__isnull=True)
                             .exclude(district='')
                             .exclude(price__isnull=True)
                             .order_by('district'))

    app_list = site.get_app_list(request)

    # Context data for the template
    context = {
        'title': 'Trọ Đà Nẵng | Dashboard',
        'total_posts': total_posts,
        'total_users': total_users,
        'posts_by_district': posts_by_district,
        'avg_price_by_district': avg_price_by_district,
        'has_permission': True,
        'is_popup': False,
        'is_nav_sidebar_enabled': True,
        'site_title': 'Trọ Đà Nẵng',
        'site_header': 'Trọ Đà Nẵng | Dashboard',
        'available_apps': app_list,
    }

    return render(request, 'admin/dashboard.html', context)

# Post Admin
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('postid', 'p_date', 'district', 'ward', 'price', 'area')
    list_filter = ('district', 'ward', 'p_date')
    search_fields = ('content', 'street_address')

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_dashboard_link'] = True
        return super().changelist_view(request, extra_context=extra_context)