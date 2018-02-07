import csv
import requests

from almanac.models import ElectionEvent
from django.core.management.base import BaseCommand
from election.models import (Election, ElectionType, Race)
from geography.models import DivisionLevel
from government.models import Party


class Command(BaseCommand):
    help = (
        'Hydrates election models from electionevent objects'
    )

    dem = Party.objects.get(ap_code='dem')
    gop = Party.objects.get(ap_code='gop')
    parties = [dem, gop]
    reference_url = ('https://raw.githubusercontent.com/The-Politico/'
                     'election-calendar/master/2018/state_reference.csv')

    def add_arguments(self, parser):
        parser.add_argument(
            '--cycle',
            action='store',
            dest='cycle',
            default='2018',
            help='Specify the election cycle you want to query against'
        )
        parser.add_argument(
            '--senate_class',
            action='store',
            dest='senate_class',
            default='1',
            help='Specify the Senate class up for election'
        )

    def handle(self, *args, **options):
        cycle_events = ElectionEvent.objects.filter(
            election_day__cycle__name=options['cycle']
        )

        self.senate_class = options['senate_class']

        for event in cycle_events:
            self.hydrate_elections(event)

    def hydrate_elections(self, event):
        # skip runoffs
        if event.label in [
            ElectionEvent.PRIMARIES_RUNOFF,
            ElectionEvent.GENERAL_RUNOFF
        ]:
            return

        # get all our offices
        offices = []

        # start with the house
        districts = event.division.children.filter(
            level__name=DivisionLevel.DISTRICT
        )
        for district in districts:
            office = district.offices.get(
                body__label='U.S. House of Representatives'
            )
            offices.append(office)

        # determine by class if there is a senate seat
        senators = event.division.offices.filter(body__label='U.S. Senate')
        for senator in senators:
            if senator.senate_class == self.senate_class:
                offices.append(senator)

        # determine by reference table if there is a governorship
        r = requests.get(self.reference_url)
        reader = csv.DictReader(r.text.splitlines())
        for row in reader:
            if event.division.code_components['postal'] == row['state_code']:
                state_ref = row
                break

        if state_ref['governor_election_2018'] == 'yes':
            governor = event.division.offices.get(
                slug__endswith='governor'
            )
            offices.append(governor)

        for office in offices:
            race, created = Race.objects.get_or_create(
                office=office,
                cycle=event.election_day.cycle
            )
            if event.label == ElectionEvent.PRIMARIES:
                self.create_primary_elections(event, office, race)
            elif event.label == ElectionEvent.GENERAL:
                self.create_general_election(event, office, race)

    def create_primary_elections(self, event, office, race):
        if event.dem_primary_type == ElectionEvent.JUNGLE:
            election_type, created = ElectionType.objects.get_or_create(
                label='Jungle Primary',
                short_label='Jungle',
                slug=ElectionType.JUNGLE_PRIMARY,
                number_of_winners=2,
            )

            self.create_election(election_type, event, office, race)
        else:
            election_type, created = ElectionType.objects.get_or_create(
                label='Party Primary',
                short_label='Primary',
                slug=ElectionType.PARTY_PRIMARY,
            )

            for party in self.parties:
                self.create_election(
                    election_type, event, office, race, party
                )

    def create_general_election(self, event, office, race):
        election_type, created = ElectionType.objects.get_or_create(
            label='General Election',
            short_label='General',
            slug=ElectionType.GENERAL
        )

        self.create_election(election_type, event, office, race)

    def create_election(self, election_type, event, office, race, party=None):
        kwargs = {
            'election_type': election_type,
            'race': race,
            'election_day': event.election_day,
            'division': office.division
        }

        if party:
            kwargs['party'] = party

        Election.objects.get_or_create(**kwargs)