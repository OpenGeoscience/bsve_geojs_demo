"""Random functions to work with the BSVE api."""

from os import environ as env
import json
from hashlib import sha1
import time
from random import randint
import hmac

import requests

user_name = env.get('BSVE_USERNAME')
api_key = env.get('BSVE_APIKEY')
secret_key = env.get('BSVE_SECRETKEY')

if not (user_name and api_key and secret_key):
    raise Exception(
        'Please set BSVE_USERNAME, BSVE_APIKEY, and BSVE_SECRETKEY'
        ' environment variables.'
    )

base_url = 'http://beta-search.bsvecosystem.net'  # sandbox
# base_url = 'http://search.bsvecosystem.net'  # production

def auth_header():
    """Return a header dictionary for an authenticated request."""
    nonce = randint(0, 1e8 - 1)
    timestamp = 1000 * time.time()
    key = '%s:%s' % (api_key, secret_key)
    
    msg = '%s%i%i%s' % (
        api_key,
        timestamp,
        nonce,
        user_name
    )
    hm = hmac.new(key, msg, sha1)
    signature = hm.digest().encode('hex').rstrip('\n')
    return {
        'harbinger-authentication': 'apikey=%s;timestamp=%i;nonce=%i;signature=%s' % (
            api_key,
            timestamp,
            nonce,
            signature
        )
    }

def search(query):
    """Perform a search using the BSVE api."""
    headers = auth_header()
    headers['Content-Type'] = 'application/json'
    req = requests.post(
        base_url + '/api/search/v1/request',
        data=json.dumps(query),
        headers=headers
    )
    assert req.ok
    return req.text

def results(request):
    """Get results back from a search."""
    result = False
    while not result:
        req = requests.get(
            base_url + '/api/search/v1/result',
            params={'requestId': request},
            headers=auth_header()
        )
        assert req.ok
        search = req.json()
        result = search['status'] == 1
    return search

if __name__ == '__main__':
    import sys
    req = search({'term': ' '.join(sys.argv[1:])})
    res = results(req)
    print json.dumps(res, default=str, indent=2)
