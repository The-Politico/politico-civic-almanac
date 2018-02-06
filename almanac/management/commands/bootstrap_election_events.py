import csv
import requests
import pytz
import us

from datetime import date, datetime
from django.core.management.base import BaseCommand
from almanac.models import ElectionEvent
from election.models import ElectionDay, ElectionCycle
from geography.models import Division

base_url = ('https://raw.githubusercontent.com/The-Politico/election-calendar/'
            'master/2018')

calendar_url = '{0}/p2018_federal.csv'.format(base_url)
reference_url = '{0}/state_reference.csv'.format(base_url)
primary_poll_closing_url = '{0}/p2018_federal_eday.csv'.format(base_url)
primary_early_voting_url = '{0}/p2018_federal_ev.csv'.format(base_url)
primary_registration_url = '{0}/p2018_federal_vr.csv'.format(base_url)
general_poll_closing_url = '{0}/g2018_eday.csv'.format(base_url)
general_early_voting_url = '{0}/g2018_ev.csv'.format(base_url)
general_registration_url = '{0}/g2018_vr.csv'.format(base_url)


class Command(BaseCommand):
    help = (
        'Create election event instances based off '
        'current elections in the database'
    )

    cycle, created = ElectionCycle.objects.get_or_create(name='2018')

    def handle(self, *args, **options):
        self.create_spare_elections()

        ref = requests.get(reference_url)
        reference = csv.DictReader(ref.text.splitlines())

        cal = requests.get(calendar_url)
        rows = csv.DictReader(cal.text.splitlines())

        p_pc = requests.get(primary_poll_closing_url)
        primary_poll_closings = csv.DictReader(p_pc.text.splitlines())

        p_ev = requests.get(primary_early_voting_url)
        primary_early_voting = csv.DictReader(p_ev.text.splitlines())

        p_reg = requests.get(primary_registration_url)
        primary_registration = csv.DictReader(p_reg.text.splitlines())

        g_pc = requests.get(general_poll_closing_url)
        general_poll_closings = csv.DictReader(g_pc.text.splitlines())

        g_ev = requests.get(general_early_voting_url)
        general_early_voting = csv.DictReader(g_ev.text.splitlines())

        g_reg = requests.get(general_registration_url)
        general_registration = csv.DictReader(g_reg.text.splitlines())

        for row in rows:
            state = row['state_code']

            for ref_row in reference:
                if state == ref_row['state_code']:
                    state_info = ref_row
                    break

            for pc_row in primary_poll_closings:
                if state == pc_row['state_code']:
                    p_poll_closing = pc_row
                    break

            for ev_row in primary_early_voting:
                if state == ev_row['state_code']:
                    p_early_voting = ev_row
                    break

            for reg_row in primary_registration:
                if state == reg_row['state_code']:
                    p_registration = reg_row
                    break

            for pc_row in general_poll_closings:
                if state == pc_row['state_code']:
                    g_poll_closing = pc_row
                    break

            for ev_row in general_early_voting:
                if state == ev_row['state_code']:
                    g_early_voting = ev_row
                    break

            for reg_row in general_registration:
                if state == reg_row['state_code']:
                    g_registration = reg_row
                    break

            self.create_primaries(
                row,
                state_info,
                p_poll_closing,
                p_early_voting,
                p_registration
            )

            self.create_general(
                state_info,
                g_poll_closing,
                g_early_voting,
                g_registration
            )

    def create_primaries(
        self, row, state_info, poll_closing, early_voting, registration
    ):
        if state_info['is_state'] == 'no':
            return

        division = Division.objects.get(
            code_components__postal=row['state_code']
        )

        if poll_closing['polls_close']:
            time_zones = us.states.lookup(row['state_code']).time_zones
            poll_closing_tz = '{0} {1}'.format(
                row['p2018_federal_election_date'],
                poll_closing['polls_close'],
            )
            poll_closing_time = datetime.strptime(
                poll_closing_tz, '%Y-%m-%d %I:%M:%S %p'
            ).astimezone(pytz.timezone(time_zones[0]))
        else:
            poll_closing_time = None

        if row['p2018_federal_election_date']:
            election_day, created = ElectionDay.objects.get_or_create(
                cycle=self.cycle,
                date=row['p2018_federal_election_date'],
            )

            election_event, created = ElectionEvent.objects.get_or_create(
                election_day=election_day,
                division=division,
                label=ElectionEvent.PRIMARIES,
                dem_primary_type=self.set_null_value(
                    row.get('p2018_federal_dem_election_type')
                ),
                gop_primary_type=self.set_null_value(
                    row.get('p2018_federal_rep_election_type')
                ),
                early_vote_start=self.set_null_value(
                    early_voting.get('p2018_federal_evip_start_date')
                ),
                early_vote_close=self.set_null_value(
                    early_voting.get('p2018_federal_evip_close_date')
                ),
                vote_by_mail_application_deadline=self.set_null_value(
                    early_voting.get('p2018_federal_vbm_application_deadline')
                ),
                vote_by_mail_ballot_deadline=self.set_null_value(
                    early_voting.get('p2018_federal_ballot_return_date')
                ),
                online_registration_deadline=self.set_null_value(
                    registration.get('p2018_federal_online_vr_deadline')
                ),
                registration_deadline=self.set_null_value(
                    registration.get('p2018_federal_vr_deadline')
                ),
                poll_closing_time=poll_closing_time
            )

        if row['p2018_runoff_federal_election_date']:
            election_day, created = ElectionDay.objects.get_or_create(
                cycle=self.cycle,
                date=row['p2018_runoff_federal_election_date']
            )

            election_event, created = ElectionEvent.objects.get_or_create(
                election_day=election_day,
                division=division,
                label=ElectionEvent.PRIMARIES_RUNOFF
            )

    def create_general(
        self, state_info, poll_closing, early_voting, registration
    ):
        if state_info['is_state'] == 'no' or state_info['state_code'] == 'LA':
            return

        division = Division.objects.get(
            code_components__postal=state_info['state_code']
        )

        if poll_closing['polls_close']:
            time_zones = us.states.lookup(state_info['state_code']).time_zones
            poll_closing_tz = '2018-11-06 {0}'.format(
                poll_closing['polls_close'],
            )
            poll_closing_time = datetime.strptime(
                poll_closing_tz, '%Y-%m-%d %I:%M:%S %p'
            ).astimezone(pytz.timezone(time_zones[0]))
        else:
            poll_closing_time = None

        election_day, created = ElectionDay.objects.get_or_create(
            cycle=self.cycle,
            date=date(2018, 11, 6)
        )

        election_event, created = ElectionEvent.objects.get_or_create(
            election_day=election_day,
            division=division,
            label=ElectionEvent.GENERAL,
            early_vote_start=self.set_null_value(
                early_voting.get('g2018_evip_start_date')
            ),
            early_vote_close=self.set_null_value(
                early_voting.get('g2018_evip_close_date')
            ),
            vote_by_mail_application_deadline=self.set_null_value(
                early_voting.get('g2018_vbm_application_deadline')
            ),
            vote_by_mail_ballot_deadline=self.set_null_value(
                early_voting.get('g2018_ballot_return_date')
            ),
            online_registration_deadline=self.set_null_value(
                registration.get('g2018_online_vr_deadline')
            ),
            registration_deadline=self.set_null_value(
                registration.get('g2018_vr_deadline')
            ),
            poll_closing_time=poll_closing_time
        )

    def set_null_value(self, val):
        if val == '':
            return None
        else:
            return val

    def create_spare_elections(self):
        georgia = Division.objects.get(code_components__postal='GA')

        ga_runoff_day, created = ElectionDay.objects.get_or_create(
            cycle=self.cycle,
            date=date(2019, 1, 8)
        )

        ga_runoff, created = ElectionEvent.objects.get_or_create(
            election_day=ga_runoff_day,
            division=georgia,
            label=ElectionEvent.GENERAL_RUNOFF
        )

        louisiana = Division.objects.get(code_components__postal='LA')

        la_general_day, created = ElectionDay.objects.get_or_create(
            cycle=self.cycle,
            date=date(2018, 12, 8)
        )

        la_general, created = ElectionEvent.objects.get_or_create(
            election_day=la_general_day,
            division=louisiana,
            label=ElectionEvent.GENERAL,
            early_vote_start=date(2018, 11, 24),
            early_vote_close=date(2018, 12, 1),
            vote_by_mail_application_deadline=date(2018, 12, 4),
            vote_by_mail_ballot_deadline=date(2018, 12, 7),
            online_registration_deadline=date(2018, 11, 17),
            registration_deadline=date(2018, 11, 7)
        )