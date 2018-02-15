from django.urls import include, path
from rest_framework import routers

from .views import Home, State
from .viewsets import ElectionEventViewSet

router = routers.DefaultRouter()

router.register(
    r'election-events', ElectionEventViewSet, base_name='election_event'
)

urlpatterns = [
    path('', Home.as_view(), name='almanac-home'),
    path('<state>/calendar/index.html', State.as_view(), name='almanac-state'),
    path('api/', include(router.urls)),
]
