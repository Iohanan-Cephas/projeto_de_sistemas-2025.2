from django import template
from django.urls import reverse, NoReverseMatch

register = template.Library()

@register.simple_tag(takes_context=True)
def active(context, url_name):
    """
    Retorna 'is-active' quando a rota url_name é a atual (request.path),
    senão retorna string vazia.
    """
    request = context.get('request')
    if not request:
        return ''
    try:
        return 'is-active' if request.path == reverse(url_name) else ''
    except NoReverseMatch:
        return ''
