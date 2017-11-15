import urllib2
from threading import Thread

import time

n = 5
url = 'http://df482d16.ngrok.io/'
sleep = 0.5

endpoints = [
    'companydata/',
    'companydata/1',
    'portfolio/1',
]


def test_site(*args):
    print("thread started")
    for end in endpoints:
        full_url = url + end
        print(full_url)
        connection = urllib2.urlopen(full_url)
        connection.close()
        time.sleep(sleep)

    print("thread ended")

if __name__ == '__main__':
    for i in range(n):
        t = Thread(target=test_site)
        t.start()
