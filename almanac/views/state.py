from almanac.conf import settings as app_settings
from almanac.utils.auth import secure
from django.views.generic import TemplateView


@secure
class State(TemplateView):
    template_name = "almanac/state.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['secret'] = app_settings.SECRET_KEY
        return context
