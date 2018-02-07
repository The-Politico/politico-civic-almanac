from almanac.models import ElectionEvent
from almanac.serializers import ElectionEventSerializer

from .base import BaseViewSet


class ElectionEventViewSet(BaseViewSet):
    queryset = ElectionEvent.objects.exclude(
        event_type=ElectionEvent.GENERAL
    ).order_by('election_day__date')
    serializer_class = ElectionEventSerializer
