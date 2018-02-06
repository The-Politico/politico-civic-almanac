from django.db import models
from election.models import ElectionDay
from geography.models import Division


class ElectionEvent(models.Model):
    """A statewide election event"""
    PRIMARIES = 'Primaries'
    PRIMARIES_RUNOFF = 'Primaries Runoff'
    GENERAL = 'General'
    GENERAL_RUNOFF = 'General Runoff'

    LABELS = (
        (PRIMARIES, 'Primaries'),
        (PRIMARIES_RUNOFF, 'Primaries Runoff'),
        (GENERAL, 'General'),
        (GENERAL_RUNOFF, 'General Runoff')
    )

    label = models.CharField(max_length=100, choices=LABELS)
    election_day = models.ForeignKey(ElectionDay, on_delete=models.PROTECT)
    division = models.ForeignKey(Division, on_delete=models.PROTECT)
    early_vote_start = models.DateField(null=True, blank=True)
    early_vote_close = models.DateField(null=True, blank=True)
    vote_by_mail_application_deadline = models.DateField(null=True, blank=True)
    vote_by_mail_ballot_deadline = models.DateField(null=True, blank=True)
    online_registration_deadline = models.DateField(null=True, blank=True)
    registration_deadline = models.DateField(null=True, blank=True)
    poll_closing_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return '{0} {1}'.format(self.division.label, self.label)
