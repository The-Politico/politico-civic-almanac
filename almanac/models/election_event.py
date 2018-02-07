from django.db import models
from election.models import ElectionDay
from geography.models import Division
from uuslug import uuslug


class ElectionEvent(models.Model):
    """A statewide election event"""
    PRIMARIES = 'Primaries'
    PRIMARIES_RUNOFF = 'Primaries Runoff'
    GENERAL = 'General'
    GENERAL_RUNOFF = 'General Runoff'
    SPECIAL_PRIMARY = 'Special Primary'
    SPECIAL_RUNOFF = 'Special Runoff'
    SPECIAL_GENERAL = 'Special General'

    EVENT_TYPES = (
        (PRIMARIES, 'Primaries'),
        (PRIMARIES_RUNOFF, 'Primaries Runoff'),
        (GENERAL, 'General'),
        (GENERAL_RUNOFF, 'General Runoff'),
        (SPECIAL_PRIMARY, 'Special Primary'),
        (SPECIAL_RUNOFF, 'Special Runoff'),
        (SPECIAL_GENERAL, 'Special General')
    )

    OPEN = 'open'
    SEMI_OPEN = 'semi-open'
    SEMI_CLOSED = 'semi-closed'
    CLOSED = 'closed'
    JUNGLE = 'jungle'

    PRIMARY_TYPES = (
        (OPEN, 'Open'),
        (SEMI_OPEN, 'Semi-open'),
        (SEMI_CLOSED, 'Semi-closed'),
        (CLOSED, 'Closed'),
        (JUNGLE, 'Jungle')
    )

    slug = models.SlugField(
        blank=True, max_length=255, unique=True, editable=False)
    label = models.CharField(max_length=100)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    dem_primary_type = models.CharField(
        max_length=50,
        choices=PRIMARY_TYPES,
        null=True, blank=True
    )
    gop_primary_type = models.CharField(
        max_length=50,
        choices=PRIMARY_TYPES,
        null=True, blank=True
    )
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
        return self.label

    def save(self, *args, **kwargs):
        if not self.slug:
            slug = '{0}-{1}'.format(self.label, self.election_day.cycle.name)

            self.slug = uuslug(
                slug,
                instance=self,
                max_length=100,
                separator='-',
                start_no=2
            )

        super(ElectionEvent, self).save(*args, **kwargs)