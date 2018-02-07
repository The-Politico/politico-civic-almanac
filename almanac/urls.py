from django.urls import include, path
from rest_framework import routers

from .views import Home
from .viewsets import ElectionEventViewSet

router = routers.DefaultRouter()

router.register(r'election-events', ElectionEventViewSet)

urlpatterns = [
    path('', Home.as_view(), name='almanac-home'),
    path('api/', include(router.urls)),
]
