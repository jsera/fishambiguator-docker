# fishambiguator

It's not a fish, it's a fiiiiiiiiiiishAMBIGUATOR!!!!

Static assets are served from the fishambiguator-static directory. I'm doing this so you don't have to burden Node with serving static stuff. Stick this on another server, or apache on the same server.

Using Mocha for unit tests.

use

```
mocha test/(test file name)
```
to run an individual set of tests.


## Setup

Install PostgreSQL on the host machine, run create-db.sh to create the appropriate database.

The app requires a .env file for environment variables

example:
```
BASE_URL=joshdev.com
FACEBOOK_APP_ID=(Put the app ID here)
FACEBOOK_API_VERSION=v2.5
FACEBOOK_APP_SECRET=(Put the app secret here)
STATIC_SERVER=assets.joshdev.com
BUILD_ENV=dev
```

In /etc/hosts, set joshdev.com and assets.joshdev.com to 127.0.0.1

Start the Docker containers!