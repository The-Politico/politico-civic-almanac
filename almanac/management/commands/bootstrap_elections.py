import csv
import requests

from datetime import date
from django.core.management.base import BaseCommand
from election.models import (ElectionDay, Election, ElectionCycle,
                             ElectionType, Race)
from geography.models import Division
from government.models import Office, Body, Party
from itertools import chain
from tqdm import tqdm

calendar_url = 'https://raw.githubusercontent.com/democrats/election-calendar/master/2018/p2018_federal.csv'
reference_url = 'https://raw.githubusercontent.com/democrats/election-calendar/master/2018/state_reference.csv'


class Command(BaseCommand):
    help = (
        'Gets data from Democrats election calendar and bootstraps '
        'various election models'
    )
    cycle, created = ElectionCycle.objects.get_or_create(name='2018')

    def handle(self, *args, **options):
        ref = requests.get(reference_url)
        reference = csv.DictReader(ref.text.splitlines())

        cal = requests.get(calendar_url)
        rows = csv.DictReader(cal.text.splitlines())

        for row in rows:
            self.process_state(row, reference)

    def process_state(self, row, reference):
        for ref_row in reference:
            if ref_row['state_code'] == row['state_code']:
                state_info = ref_row
                break

        if state_info['is_state'] == 'no':
            return

        division = Division.objects.get(
            code_components__postal=row['state_code']
        )

        offices_for_election = self.get_offices(row, division, state_info)

        print('Adding elections for {0}'.format(state_info['state_name']))
        for office in tqdm(offices_for_election):
            self.create_elections(row, office, division, state_info)

    def get_offices(self, row, division, state_info):
        # get all house seats in state
        house = Body.objects.get(
            label='U.S. House of Representatives'
        )
        house_offices = Office.objects.filter(
            division__parent=division,
            body=house
        )

        # see if there are senators
        senate = Body.objects.get(label='U.S. Senate')
        senate_offices = Office.objects.filter(
            division=division,
            body=senate,
            senate_class=Office.FIRST_CLASS
        )

        if state_info['governor_election_2018']:
            governor = Office.objects.filter(
                division=division,
                name='{0} Governor'.format(state_info['state_name'])
            )

        return list(chain(
            house_offices,
            senate_offices,
            governor
        ))

    def create_elections(self, row, office, division, state_info):
        race, created = Race.objects.get_or_create(
            office=office,
            cycle=self.cycle,
        )
        dem = Party.objects.get(ap_code='dem')
        gop = Party.objects.get(ap_code='gop')
        parties = [dem, gop]

        if row['p2018_federal_election_date']:
            primary_day, created = ElectionDay.objects.get_or_create(
                cycle=self.cycle,
                date=row['p2018_federal_election_date'],
            )

            for party in parties:
                cal_party_slug = 'dem' if party.ap_code == 'dem' else 'rep'
                primary_type = row['p2018_federal_{0}_election_type'.format(
                    cal_party_slug
                )]
                label = '{0} Primary'.format(primary_type.title())

                election_type, created = ElectionType.objects.get_or_create(
                    label=label,
                    slug='{0}-primary'.format(primary_type),
                    ap_code='P',
                    primary_type=primary_type
                )

                election, created = Election.objects.get_or_create(
                    election_type=election_type,
                    race=race,
                    party=party,
                    election_day=primary_day,
                    division=division
                )

        general_election_day, created = ElectionDay.objects.get_or_create(
            cycle=self.cycle,
            date=date(2018, 11, 6)
        )

        general_election_type, created = ElectionType.objects.get_or_create(
            label='General Election',
            short_label='General',
            slug='general',
            ap_code='G',
        )

        general_election, created = Election.objects.get_or_create(
            election_type=general_election_type,
            race=race,
            election_day=general_election_day,
            division=division
        )
