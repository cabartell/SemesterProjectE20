# Playlist API

## Run locally

simply run the command:

```bash
docker-compose up
```

## Root URL

<http://mint.stream.stud-srv.sdu.dk/playlist/>

## Add playlist

To add a playlist, send a `POST` request to `/add`.

```bash
[ POST ] http://mint.stream.stud-srv.sdu.dk/playlist/add
```

Example of the request body in JSON:

```json
{
    "thumbnail":"https://i.ytimg.com/vi/JQ1txLdu6qg/hqdefault.jpg?sqp=-oaymwEWCKgBEF5IWvKriqkDCQgBFQAAiEIYAQ==&rs=AOn4CLBe8CMYvy4PtGuQDwCrM0h0SGvz2w",
    "name":"my dubstep mix",
    "description":"it's very good :)",
    "owner_id":"3125f1019fe6a395b0f0e9e4",
    "public_status":true,
    "duration": 612,
    "release_date": "2020-02-11"
}
```

`*` only "name" and "owner_id" are required.

## Rename a playlist

To rename a playlist, send a `PUT` request to `/rename/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/rename/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "name":"THE BEST DUBSTEP PLAYLIST OUT THERE!!"
}
```

## Update a playlist's description

To update a playlist's description, send a `PUT` request to `/description/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/description/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "description":"This is a collection of all my favorite songs from 2020!"
}
```

## Update a playlist's thumbnail

To update a playlist's thumbnail, send a `PUT` request to `/thumbnail/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/thumbnail/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "thumbnail":"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/youtube-thumbnail-retrowave-design-template-facd275829297c4a471f2f1af6436508_screen.jpg?ts=1561496227"
}
```

## Update a playlist's release date

To update a playlist's release date, send a `PUT` request to `/release/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/release/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "release_date":"2/4/2008"
}
```

## Update a playlist's duration

**A playlists duration automaticly gets updated if the songid matches the id used for fetching the metadata.**

*Meaning that we do not recommend manually updating the value.*

To update a playlist's duration, send a `PUT` request to `/duration/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/duration/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON: 

**NOTICE**

* The duration should be a number
* The value should be the summed duration of every song in the playlist displayed in seconds

```json
{
    "duration":2010
}
```

## Toggle the visibility of a playlist

To toggle the visibility of a playlist between public and private, send a `PUT` request to `/visibility/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/visibility/5f9e162b40a39e0011f9e5f3
```

## Get a list of all playlists

To get a full list of all playlists, send a `GET` request to `/`.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/
```

## Get a playlist from id

To get a playlist from its id, send a `GET` request to `/:id` where `:id` is the id of the playlist.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/5f9e162b40a39e0011f9e5f3
```

## Get a list of playlists owned by a specific user

To get a user's playlists, send a `GET` request to `/user/:owner_id` where `:owner_id` is the id of the owner.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/user/3125f1019fe6a395b0f0e9e4
```

## Get a list of public playlists owned by a specific user

To get a user's public playlists, send a `GET` request to `/user/:owner_id/public` where `:owner_id` is the id of the owner.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/user/3125f1019fe6a395b0f0e9e4/public
```

## Get a list of public playlists which names contains a specific string

To get a list of public playlists which names contains a specific string, send a `GET` request to `/search/:name` where `:name` is the string that should be in the playlist name.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/search/dubstep
```

## Get a list of playlists with a specific name

To get a list of playlists with a specific name, send a `GET` request to `/name/:name` where `:name` is the name of the playlist.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/name/my%20dubstep%20mix
```

## Delete a playlist by id

To delete a playlist by id, send a `DELETE` request to `/delete/:id` where `:id` is the id of the playlist.

```bash
[ DELETE ] http://mint.stream.stud-srv.sdu.dk/playlist/delete/5f9e162b40a39e0011f9e5f3
```

## Get a list of songs from a specific playlist by id

To get a list of songs from a specific playlist by id, send a `GET` request to `/songs/:id` where `:id` is the id of the playlist.

```bash
[ GET ] http://mint.stream.stud-srv.sdu.dk/playlist/songs/5f9e162b40a39e0011f9e5f3
```

## Add a song to a playlist by id

To add a song to a playlist by id, send a `PUT` request to `/add/songs/:id` where `:id` is the id of the playlist.

```bash
[ PUT ] http://mint.stream.stud-srv.sdu.dk/playlist/add/songs/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "songs": [
        {
            "songid":"90a916e011390f5ef3e5bf24"
        },
        {
            "songid":"f01f51be031efa999352e406",
            "order":4
        }
    ]
}
```

The example above will:

* Add the song with the id "90a916e011390f5ef3e5bf24" to the end of the playlist
* Add the song with the id "f01f51be031efa999352e406" to the 4th entry

## Delete all the songs from a playlist by id

To delete all the songs from a playlist by id, send a `DELETE` request to `/delete/songs/:id` where `:id` is the id of the playlist.

```bash
[ DELETE ] http://mint.stream.stud-srv.sdu.dk/playlist/delete/songs/5f9e162b40a39e0011f9e5f3
```

## Delete specific songs from a playlist by id

To delete specific songs from a playlist by id, send a `DELETE` request to `/delete/song/:id` where `:id` is the id of the playlist.

```bash
[ DELETE ] http://mint.stream.stud-srv.sdu.dk/playlist/delete/song/5f9e162b40a39e0011f9e5f3
```

Example of the request body in JSON:

```json
{
    "songs": [
        {
            "songid":"f01f51be031efa999352e406",
            "order":3
        },
        {
            "order":0
        },
        {
            "songid":"b5069f21ee39f10a9154e3f0"
        }
    ]
}
```

The example above will:

* Remove the song with the id "f01f51be031efa999352e406" from the playlist, if it is the 3rd entry
* Remove the song at entry 0
* Remove every song that matches the song id "b5069f21ee39f10a9154e3f0"
