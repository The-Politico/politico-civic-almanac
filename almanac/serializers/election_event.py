from almanac.models import ElectionEvent
from election.serializers import ElectionDaySerializer
from geography.serializers import DivisionSerializer
from rest_framework import serializers


class ElectionEventSerializer(serializers.ModelSerializer):
    division = DivisionSerializer()
    election_day = ElectionDaySerializer()

    class Meta:
        model = ElectionEvent
        fields = '__all__'
