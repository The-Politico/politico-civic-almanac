
import os
from glob import glob

from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from almanac.utils.aws import defaults, get_bucket
from geography.models import Division, DivisionLevel


class Command(BaseCommand):
    help = 'Bakes JavaScript and CSS for calendar'

    def add_arguments(self, parser):
        parser.add_argument(
            '--production',
            default=False,
            action='store_true',
            help="Publish to production"
        )
        parser.add_argument(
            '--placeholders',
            dest='placeholders',
            default=False,
            action='store_true',
            help='Publish placeholder state pages'
        )

    def upload(self, file, key, content_type):
        print(key)
        with open(file, 'rb') as f:
            self.bucket.upload_fileobj(f, key, {
                'CacheControl': defaults.CACHE_HEADER,
                'ACL': defaults.ACL,
                'ContentType': content_type
            })

    def handle(self, *args, **options):
        print('> Publishing statics')
        self.bucket = get_bucket()

        print('> >> Building statics')

        base_key = 'election-results/2018/'

        for file in glob('../almanac/static/almanac/js/*'):
            filename, ext = os.path.splitext(file.split('/')[-1])
            key = os.path.join(
                base_key,
                'calendar',
                '{}{}'.format(filename, ext)
            )
            self.upload(file, key, 'text/javascript')

        for file in glob('../almanac/static/almanac/css/*'):
            filename, ext = os.path.splitext(file.split('/')[-1])
            key = os.path.join(
                base_key,
                'calendar',
                '{}{}'.format(filename, ext)
            )
            self.upload(file, key, 'text/css')

        for file in glob('../almanac/static/almanac/images/*'):
            filename = file.split('/')[-1]
            key = os.path.join(
                base_key,
                'calendar',
                'images',
                filename
            )
            self.upload(file, key, 'image/svg+xml')

        template_string = render_to_string('almanac/home.export.html', {})
        html_key = os.path.join(
            base_key,
            'calendar',
            'index.html'
        )
        self.bucket.put_object(
            Key=html_key,
            ACL=defaults.ACL,
            Body=template_string,
            CacheControl=defaults.CACHE_HEADER,
            ContentType='text/html'
        )

        states = Division.objects.filter(
            level__name=DivisionLevel.STATE
        )

        for state in states:
            context = {
                'state': state,
                'statics_path': '../../calendar',
                'data': './data.json'
            }
            template_string = render_to_string(
                'almanac/state.export.html', context
            )
            html_key = os.path.join(
                base_key,
                state.slug,
                'calendar',
                'index.html'
            )
            print(html_key)
            self.bucket.put_object(
                Key=html_key,
                ACL=defaults.ACL,
                Body=template_string,
                CacheControl=defaults.CACHE_HEADER,
                ContentType='text/html'
            )

            if options['placeholders']:
                context['statics_path'] = '../calendar'
                context['data'] = './calendar/data.json'
                placeholder_template_string = render_to_string(
                    'almanac/state.export.html', context
                )
                placeholder_key = os.path.join(
                    base_key,
                    state.slug,
                    'index.html'
                )
                print(placeholder_key)
                self.bucket.put_object(
                    Key=placeholder_key,
                    ACL=defaults.ACL,
                    Body=placeholder_template_string,
                    CacheControl=defaults.CACHE_HEADER,
                    ContentType='text/html'
                )
