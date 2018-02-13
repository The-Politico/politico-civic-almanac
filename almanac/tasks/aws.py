import logging
import os

from almanac.models import ElectionEvent
from almanac.serializers import ElectionEventSerializer
from almanac.utils.aws import defaults, get_bucket
from celery import shared_task
from rest_framework.renderers import JSONRenderer

logger = logging.getLogger('tasks')

OUTPUT_PATH = 'election-results/{0}/calendar/'


@shared_task(acks_late=True)
def serialize_calendar(cycle, division):
    data = []

    events = ElectionEvent.objects.filter(
        election_day__cycle__name=cycle
    ).exclude(
        event_type=ElectionEvent.GENERAL
    ).order_by('election_day__date', 'division__label')
    for event in events:
        serialized = ElectionEventSerializer(event)
        data.append(serialized.data)

    key = os.path.join(
        OUTPUT_PATH.format(cycle),
        'data.json'
    )
    json_string = JSONRenderer().render(data)
    publish_to_aws(json_string, key)

    state_data = []
    state_events = ElectionEvent.objects.filter(
        division=division,
        election_day__cycle__name=cycle
    ).order_by('election_day__date', 'division__label')

    for event in state_events:
        serialized = ElectionEventSerializer(event)
        state_data.append(serialized.data)

    state_key = os.path.join(
        OUTPUT_PATH.format('{0}/{1}'.format(
            cycle, division.slug
        )),
        'data.json'
    )
    state_json_string = JSONRenderer().render(state_data)
    publish_to_aws(state_json_string, state_key)


def publish_to_aws(data, key):
    bucket = get_bucket()

    bucket.put_object(
        Key=key,
        ACL=defaults.ACL,
        Body=data,
        CacheControl=defaults.CACHE_HEADER,
        ContentType='application/json'
    )

    logger.info('Published to AWS')
