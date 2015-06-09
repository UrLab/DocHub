import requests
import xmltodict
from datetime import date
import os
from users.models import User, Inscription


class NetidBackend(object):
    ULB_AUTH = 'https://www.ulb.ac.be/commons/check?_type=normal&_sid={}&_uid={}'

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def authenticate(self, sid=None, uid=None):
        if not (sid and uid):
            return None

        resp = requests.get(self.ULB_AUTH.format(sid, uid))
        if not resp.ok:
            return None

        try:
            os.mkdir("/tmp/netids/")
            with open("/tmp/netids/{}__{}".format(sid, uid), "w") as f:
                f.write(resp.text)
        except OSError:
            pass

        try:
            user_dict = self._parse_response(resp.text)
        except:
            return None

        try:
            user = User.objects.get(netid=user_dict['netid'])
        except User.DoesNotExist:
            user = User.objects.create_user(
                netid=user_dict['netid'],
                email=user_dict['mail'],
                first_name=user_dict['first_name'],
                last_name=user_dict['last_name'],
                registration=user_dict['raw_matricule'],
            )

        for inscription in user_dict['inscriptions']:
            try:
                year = int(user_dict['year'])
            except ValueError:
                continue

            Inscription.objects.get_or_create(
                user=user,
                faculty=user_dict['fac'],
                section=user_dict['slug'],
                year=year,
            )

        return user

    def _parse_response(self, xml):
        if 'errMsgFr' in xml:
            raise Exception('Response was an error')

        doc = xmltodict.parse(xml)
        user = {}

        user['netid'] = doc['intranet']['session']['user']['username']

        user['last_name'] = doc['intranet']['session']['user']['identity']['nom'].title()
        user['first_name'] = doc['intranet']['session']['user']['identity']['prenom']
        user['mail'] = doc['intranet']['session']['user']['identity']['email'].lower()
        user['biblio'] = doc['intranet']['session']['user']['identity']['biblio']

        birthday = doc['intranet']['session']['user']['identity']['dateNaissance']
        user['birthday'] = date(*reversed(map(lambda x: int(x), birthday.split('/'))))

        user['raw_matricule'] = doc['intranet']['session']['user']['identity']['matricule']
        user['matricule'] = user['raw_matricule'].split(":")[-1]

        user['inscriptions'] = []

        if not isinstance(doc['intranet']['session']['user']['identity']['inscriptions']['inscription'], list):
            inscriptions = [doc['intranet']['session']['user']['identity']['inscriptions']['inscription']]
        else:
            inscriptions = doc['intranet']['session']['user']['identity']['inscriptions']['inscription']

        for inscription in inscriptions:
            user['inscriptions'].append({
                'year': inscription['anac'],
                'slug': inscription['anet'],
                'fac': inscription['facid'],
            })

        return user