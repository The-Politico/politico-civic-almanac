![POLITICO](https://rawgithub.com/The-Politico/src/master/images/logo/badge.png)

# django-politico-civic-almanac

### Quickstart

1. Install the app.

  ```
  $ pip install django-politico-civic-almanac
  ```

2. Add the app to your Django project and configure settings.

  ```python
  INSTALLED_APPS = [
      # ...
      'rest_framework',
      'almanac',
  ]

  #########################
  # almanac settings

  ALMANAC_SECRET_KEY = ''
  ALMANAC_AWS_ACCESS_KEY_ID = ''
  ALMANAC_AWS_SECRET_ACCESS_KEY = ''
  ALMANAC_AWS_REGION = ''
  ALMANAC_AWS_S3_BUCKET = ''
  ALMANAC_CLOUDFRONT_ALTERNATE_DOMAIN = ''
  ALMANAC_S3_UPLOAD_ROOT = ''
  ```

### Developing

##### Setting up a PostgreSQL database

1. Run the make command to setup a fresh database.

  ```
  $ make database
  ```

2. Add a connection URL to the `.env` file.

  ```
  DATABASE_URL="postgres://localhost:5432/almanac"
  ```


  (note, in order to access bootstrapping, you will need an API key to the Propublica Congress API in your `.env` file as well.)

  ```
  PROPUBLICA_CONGRESS_API_KEY=apikey
  ```

3. Run migrations from the example app.

  ```
  $ cd example
  $ pipenv run python manage.py migrate
  ```

4. Bootstrap your database with initial data.

  ```
  $ pipenv run python manage.py bootstrap_almanac
  ```

5. Bootstrap the election events

  ```
  $ pipenv run python manage.py bootstrap_election_events
  ```


##### Running a development server

Developing python files? Move into example directory and run the development server with pipenv.

  ```
  $ cd example
  $ pipenv run python manage.py runserver
  ```

Developing static assets? Move into the pluggable app's staticapp directory and start the node development server, which will automatically proxy Django's development server.

  ```
  $ cd almanac/staticapp
  $ gulp
  ```

Want to not worry about it? Use the shortcut make command.

  ```
  $ make dev
  ```