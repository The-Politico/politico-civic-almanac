from almanac.models import ElectionEvent
from almanac.serializers import ElectionEventSerializer

from .base import BaseViewSet


class ElectionEventViewSet(BaseViewSet):
    queryset = ElectionEvent.objects.all()
    serializer_class = ElectionEventSerializer
