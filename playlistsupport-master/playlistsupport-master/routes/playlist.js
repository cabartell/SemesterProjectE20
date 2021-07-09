const router = require('express').Router();
let Playlist = require('../models/playlist.model');
const cors = require('cors');
const getData = require('../getSongDuration');

let corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}

router.use(cors(corsOptions));

/**
 * Update a playlist's duration to the summed duration of all the songs
 * @param {playlist} playlist 
 */
async function updatePlaylistDuration(playlist) {
  let data = await getData.getSongData(playlist.songs)
  await playlist.updateOne({ $set: { duration: parseInt(data) } }, { multi: true })
    .catch(err => console.log('Error: ' + err));
}

// Get a list of all the playlists
router.route('/').get((req, res) => {
  Playlist.find({})
    .then(playlists => res.json(playlists))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a playlist from id
router.route('/:id').get((req, res) => {
  Playlist.findById(req.params.id)
    .then(playlist => res.json(playlist))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a playlist from owner_id
router.route('/user/:owner_id').get((req, res) => {
  Playlist.find({ owner_id: req.params.owner_id })
    .then(playlist => res.json(playlist))
    .catch(err => res.status(400).json('Error: ' + err));
});

//Get all public playlist from owner_id
router.route('/user/:owner_id/public').get((req, res) => {
  Playlist.find({ owner_id: req.params.owner_id, public_status: true })
    .then(playlist => res.json(playlist))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a public playlist from string name
router.route('/search/:name').get((req, res) => {
  Playlist.find({ name: { $regex: req.params.name, '$options': 'i' }, public_status: true })
    .then(playlist => res.json(playlist))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a playlist from name
router.route('/name/:name').get((req, res) => {
  Playlist.find({ name: req.params.name })
    .then(playlist => res.json(playlist))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a playlist from id
router.route('/delete/:id').delete((req, res) => {
  Playlist.findOneAndDelete({ _id : req.params.id })
    .then(() => res.json(`The playlist with the id: ${req.params.id}, has been deleted.`))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Display songs fra a playlist throught id
router.route('/songs/:id').get((req, res) => {
  Playlist.findById(req.params.id)
    .then(playlist => res.json(playlist.songs))
    .catch(err => res.status(400).json('Error' + err));
});

// Add track to a playlist from id
router.route('/add/songs/:id').put((req, res) => {
  let songs = req.body.songs;

  Playlist.findById(req.params.id)
    .then(async playlist => {

      let currentSongs = playlist.songs;
      let currentSongsLength = currentSongs.length;
      for (let i in songs) {

        let songid = songs[i].songid;
        let order = songs[i].order;

        if (order != undefined && currentSongsLength >= order) {
          for (let j = 0; j < currentSongs.length - order; j++) {
            currentSongs[j + order].order++;
          }
          currentSongs.splice(order, 0, {
            songid: songid,
            order: order
          })

        } else {
          currentSongs.push({
            songid: songid,
            order: currentSongsLength
          })
          currentSongsLength++;
        }
      }

      await playlist.updateOne({ $set: { songs: currentSongs } }, { multi: true })
        .catch(err => res.status(400).json('Error' + err));

      await updatePlaylistDuration(playlist);

    })
    .then((() => res.json('songs added to playlist')))
    .catch(err => res.status(400).json('Error' + err));
});

//Delete all tracks from playlist from id
router.route('/delete/songs/:id').delete((req, res) => {
  Playlist.findById(req.params.id)
    .then(async playlist => {
      await playlist.updateOne({ $set: { songs: [] } }, { multi: true })
        .then(() => res.json('All tracks remove from ' + playlist.name))
        .catch(err => res.status(400).json('Error' + err));
      await updatePlaylistDuration(playlist);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Delete a track from playlist from id
router.route('/delete/song/:id').delete((req, res) => {
  let songs = req.body.songs;

  Playlist.findById(req.params.id)
    .then(async playlist => {
      let status = "";
      let currentSongs = playlist.songs;
      for (let i = 0; i < currentSongs.length; i++) {
        for (let j in songs) {
          if (songs[j].songid != undefined && songs[j].order != undefined) {
            if (currentSongs[i].songid == songs[j].songid && currentSongs[i].order == songs[j].order) {
              status += `${currentSongs[i].songid}, `
              remove(currentSongs, currentSongs[i]);
              i--;

            }
          } else if (songs[j].songid != undefined && songs[j].order == undefined) {
            if (currentSongs[i].songid == songs[j].songid) {
              status += `${currentSongs[i].songid}, `
              remove(currentSongs, currentSongs[i]);
              i--;

            }
          } else if (songs[j].songid == undefined && songs[j].order != undefined) {
            if (currentSongs[i].order == songs[j].order) {
              status += `${currentSongs[i].order}, `
              remove(currentSongs, currentSongs[i]);
              i--;

            }
          }
        }
      }

      currentSongs = setOrder(currentSongs)
      await playlist.updateOne({ $set: { songs: currentSongs } }, { multi: true })
        .then(() => res.json(`${status} removed from playlist`))
        .catch(err => res.status(400).json('Error: ' + err));

      await updatePlaylistDuration(playlist);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Sets the order of the playlist songs accordingly
 * @param {array} playlist 
 */
function setOrder(array) {

  let orderedSongList = [];

  for (let i in array) {
    orderedSongList[i] = {
      songid: array[i].songid,
      order: parseInt(i)
    }
  }

  return orderedSongList
}

/**
 * removes the first given element from array
 * @param {array} array 
 * @param {*} element 
 */
function remove(array, element) {
  let index = array.indexOf(element);
  array.splice(index, 1);
}

// Toggle visibility of the playlist to public
router.route('/visibility/:id').put((req, res) => {
  Playlist.findById(req.params.id)
    .then(playlist => {
      console.log(playlist.public_status)
      playlist.updateOne({ $set: { public_status: !playlist.public_status } })
        .then((() => res.json(playlist.name + ' public status has been changed to ' + !playlist.public_status)))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Rename playlist
router.route('/rename/:id').put((req, res) => {
  Playlist.findById(req.params.id).then(playlist => {
    playlist.updateOne({ $set: { name: req.body.name } }, { multi: true })
      .then((() => res.json(' the playlist name has has been updated')))
      .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Update playlist's description
router.route('/description/:id').put((req, res) => {
  Playlist.findById(req.params.id).then(playlist => {
    playlist.updateOne({ $set: { description: req.body.description } }, { multi: true })
      .then((() => res.json(`The playlist description has has been updated to ${req.body.description}`)))
      .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Update playlist's thumbnail
router.route('/thumbnail/:id').put((req, res) => {
  Playlist.findById(req.params.id).then(playlist => {
    playlist.updateOne({ $set: { thumbnail: req.body.thumbnail } }, { multi: true })
      .then((() => res.json(`The playlist thumbnail has has been updated to ${req.body.thumbnail}`)))
      .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Update playlist's release date
router.route('/release/:id').put((req, res) => {
  Playlist.findById(req.params.id).then(playlist => {
    playlist.updateOne({ $set: { release_date: req.body.release_date } }, { multi: true })
      .then((() => res.json(`The playlist release date has has been updated to ${req.body.release_date}`)))
      .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

// TODO SHOULD BE DONE AUTOMATICLY
//Update playlist's duration
router.route('/duration/:id').put((req, res) => {
  Playlist.findById(req.params.id).then(playlist => {
    playlist.updateOne({ $set: { duration: req.body.duration } }, { multi: true })
      .then((() => res.json(`The playlist duration has has been updated to ${req.body.duration}`)))
      .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add playlist
router.route('/add').post((req, res) => {

  const thumbnail = req.body.thumbnail;
  const name = req.body.name;
  const description = req.body.description;
  const owner_id = req.body.owner_id;
  const public_status = req.body.public_status;
  const duration = req.body.duration;
  const release_date = req.body.release_date;

  const newPlaylist = new Playlist({
    thumbnail,
    name,
    description,
    owner_id,
    public_status,
    duration,
    release_date
  });

  newPlaylist.save()
    .then(() => res.json('Playlist Added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
