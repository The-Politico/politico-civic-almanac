from almanac.models import ElectionEvent
from election.serializers import ElectionDaySerializer
from geography.serializers import DivisionSerializer
from government.serializers import OfficeSerializer
from rest_framework import serializers


class ElectionEventSerializer(serializers.ModelSerializer):
    division = DivisionSerializer()
    election_day = ElectionDaySerializer()
    senate_election = serializers.SerializerMethodField()
    governor_election = serializers.SerializerMethodField()

    def get_senate_election(self, obj):
        return obj.has_senate_election()

    def get_governor_election(self, obj):
        return obj.has_governor_election()

    class Meta:
        model = ElectionEvent
        fields = '__all__'
