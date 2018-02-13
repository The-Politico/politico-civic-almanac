from almanac.models import ElectionEvent
from almanac.serializers import ElectionEventSerializer

from .base import BaseViewSet


class ElectionEventViewSet(BaseViewSet):
    serializer_class = ElectionEventSerializer

    def get_queryset(self):
        queryset = ElectionEvent.objects.all().order_by(
            'election_day__date', 'division__label'
        )

        state = self.request.query_params.get('state', None)
        if state is not None:
            queryset = queryset.filter(division__slug=state)
        else:
            queryset = queryset.exclude(event_type=ElectionEvent.GENERAL)

        return queryset
