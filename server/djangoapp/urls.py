from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    path('get_cars', views.get_cars, name='get_cars'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_request, name='logout'),
    path('registration', views.registration, name='registration'),

    path('dealers', views.get_dealerships, name='dealers'),
    path('dealers/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),
    path('reviews/<int:dealer_id>', views.get_dealer_reviews, name='dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)