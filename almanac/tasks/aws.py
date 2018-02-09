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
def serialize_calendar(cycle):
    data = []

    events = ElectionEvent.objects.filter(
        election_day__cycle__name=cycle
    )
    for event in events:
        serialized = ElectionEventSerializer(event)
        data.append(serialized.data)

    json_string = JSONRenderer().render(data)
    publish_to_aws(json_string, cycle)


def publish_to_aws(data, cycle):
    key = os.path.join(
        OUTPUT_PATH.format(cycle),
        'data.json'
    )

    bucket = get_bucket()

    bucket.put_object(
        Key=key,
        ACL=defaults.ACL,
        Body=data,
        CacheControl=defaults.CACHE_HEADER,
        ContentType='application/json'
    )

    logger.info('Published to AWS')
