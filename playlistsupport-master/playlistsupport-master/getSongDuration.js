const fetch = require('node-fetch');

/**
 * Fetch and return the summed duration of all songs
 * @param {array} id 
 */
async function getSongData(songArray) {
    let url = `http://manjaro.stream.stud-srv.sdu.dk/service01/getMusic?musicId=`; // should be put in env (better practice)
    let playlistDuration = 0;

    for (let i = 0; i < songArray.length; i++) {
        await fetch(url + songArray[i].songid).then(res => res.json()).then(res => {
            if (res.Metadata != undefined) {
                playlistDuration += formatToSeconds(res.Metadata.SongDuration);
            }
        });
    }

    return playlistDuration;

}

/**
 * Takes 'xHyMzS' (10H20M44S) format and turnes it to seconds
 * @param {*} string 
 */
function formatToSeconds(string) {
    let seconds = string.split('S').join();
    let minuts = seconds.split('M').join();
    let hours = minuts.split('H').join();

    let newString = hours.split(',');
    remove(newString, newString.lastIndexOf())

    let duration = 0;

    for (let i = newString.length - 1; i >= 0; i--) {
        if (i == newString.length - 1) {
            duration += parseInt(newString[i]);
        } else if (i == newString.length - 2) {
            duration += parseInt(newString[i] * 60);
        } else if (i == newString.length - 3) {
            duration += parseInt(newString[i] * 3600);
        }
    }

    return duration;
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

module.exports.getSongData = getSongData;
module.exports.formatToSeconds = formatToSeconds;
module.exports.remove = remove;