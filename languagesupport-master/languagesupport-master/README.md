# Language API

## Run locally

Simply run the command

```bash
docker-compose up
```

## Root URL

<http://mint.stream.stud-srv.sdu.dk/language/>

## Update the database

To update the database with the newest CSV-data from [google sheets](https://docs.google.com/spreadsheets/d/e/2PACX-1vRJteiV5t09dF7MB8Ua4zE50YJ7QZybnzcsdOFffKGb0yJ7jy7U6dJBMclg5wZi9AsvXHE7TZUaDKci/pubhtml?gid=1034704696&single=true), simply send a `POST` request to `/update`. We recommend using [postman](https://www.postman.com/) for this.

```bash
[ POST ] http://mint.stream.stud-srv.sdu.dk/language/update
```

## Get the date/time of when the database was last updated

To get the date/time when the database was last updated, simply send a `GET` request to `/update`.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/update
```

## Get a list of all languages with content-strings

To get a list of all languages with content-strings, simply send a `GET` request to `/`.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/
```

## Get a list of all languages without content-strings

To get a list of all languages without content-strings, simply send a `GET` request to `/languages`.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/languages
```

## Get language data from id

To get the language data from the language id, simply send a `GET` request to `/id/:id` where `:id` is the id of the language.

Example of use:

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/id/5f9e162b40a39e0011f9e5f3
```

## Get language data from language code

To get the language data from the language code, simply send a `GET` request to `/code/:code` where `:code` is the language code of the language.

Example of use:

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/code/da
```

## Get language data from language name

To get the language data from the language name, simply send a `GET` request to `/language/:name` where `:name` is the language name of the language.

Example of use:

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/language/language/English
```
