const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    thumbnail: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: false },
    owner_id: { type: String, required: true },
    public_status: { type: Boolean, required: false, default: false },
    duration: { type: Number, required: false, default: 0 },
    release_date: { type: Date, required: false, default: Date.now() },
    songs: { type: Array, required: false }
});

module.exports = mongoose.model('Playlist', playlistSchema);
/*

{
    "thumbnail":"https://i.pinimg.com/originals/da/18/3e/da183e46c3de1eaefa4f6705ca9a50dd.jpg",
    "name":"Roy Woods",
    "description":"yeah yeah",
    "owner_id":"someid",
    "public_status":true,
    "duration": 200,
    "release_date": "2014-01-01T23:28:56.782Z",
    "songs": [
        {
            ...
        }
    ]
}

*/