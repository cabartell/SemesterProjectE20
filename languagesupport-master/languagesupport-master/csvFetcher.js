const fetch = require('node-fetch');
const fs = require('fs');
let Language = require('./models/language.model');

let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJteiV5t09dF7MB8Ua4zE50YJ7QZybnzcsdOFffKGb0yJ7jy7U6dJBMclg5wZi9AsvXHE7TZUaDKci/pub?gid=1034704696&single=true&output=csv";
let frozenColumn = 3;
let lastUpdated = Date.now();

/**
 * Fetches the csv file from Google Sheets
 */
async function fetchCSV() {
    let startTime = Date.now();
    console.log("Fetching csv file from Google sheets...");
    let csvText = String(await fetch(url).then(res => res.text()));
    let endTime = (Date.now() - startTime)/1000;

    console.log(`Fetching took ${endTime} seconds!`);

    //saveAsCsv(csvText);

    //saveAsJson(csvText);

    saveToDatabase(csvText);

    lastUpdated = Date.now();
}

/**
 *  Saves the textString to the database
 */ 
function saveToDatabase(csvText) {

    let csvRows = csvText.split('\n');

    for (let i = 0; i < csvRows.length; i++) {

        if (i == 0) { continue; } // Skips the first line

        let cells = csvRows[i].split(',');

        let langCode = cells[1];
        let language = cells[0];
        let nativeLanguage = cells[2];
        let textStrings = {};

        for (let j = 0; j < cells.length; j++) {

            let cell_value = cells[j];

            if (j >= frozenColumn) {
                let id = "id" + String(j - frozenColumn);
                textStrings[id] = cell_value;

                // The last cell ends with "\r", so this is a fix for that issue
                if (j == cells.length - 1) {
                    String(textStrings[id] = cell_value.substring(0, cell_value.length - 1));
                }
            }
        }

        const newLanguage = new Language({
            code: langCode,
            language: language,
            nativeLanguage: nativeLanguage,
            strings: textStrings
        })

        newLanguage.save()
            .then(() => console.log(`[-] ${language} Added!`))
            .catch(() => {
                Language.findOne({ code: langCode, strings: textStrings, nativeLanguage: nativeLanguage, language: language }) 
                    .then(res => {
                        if (res == null) {
                            Language.updateOne({ code: langCode }, { $set: { nativeLanguage: nativeLanguage, language: language, strings: textStrings },  }, { upsert: true })
                                .then(() => { 
                                    console.log(`[#] ${language} has been updated!`);
                                })
                                .catch(err => console.log(err));
                        } else {
                            console.log(`[.] ${language} is up to date.`);
                        }
                }).catch(err => console.log(err));
            })
    }
}

/**
 * Pretty print the date
 */
function getLastUpdated() {
    let isoDate = new Date(lastUpdated).toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '');    // delete the dot and everything after

    return isoDate;
}

/* eslint-disable no-unused-vars */

/**
 * Saves the textString as a .csv file 
 */ 
function saveAsCsv(csvText) {
    // eslint-disable-previous-line no-unused-vars
    fs.writeFileSync('./data/data.csv', csvText);
}

/**
 * Saves the textString as a .json file
 */
function saveAsJson(csvText) {

    let csvColumns = csvText.split('\n');
    let languageJsonObject = {};

    for (let i = 0; i < csvColumns.length; i++) {

        if (i == 0) { continue; } // Skips the first line

        let row = csvColumns[i].split(',');

        let language = row[0];
        let langCode = row[1];
        let nativeLanguage = row[2];
        let textStrings = {};

        for (let j = 0; j < row.length; j++) {

            let cell = row[j];

            if (j >= frozenColumn) {
                let id = "id" + String(j - frozenColumn);
                textStrings[id] = cell;

                // The last cell ends with "\r", so this is a fix for that issue
                if (j == row.length - 1) {
                    String(textStrings[id] = cell.substring(0, cell.length - 1));
                }
            }
        }

        languageJsonObject[langCode] = {};
        languageJsonObject[langCode]["name"] = language;
        languageJsonObject[langCode]["code"] = langCode;
        languageJsonObject[langCode]["nativeLanguage"] = nativeLanguage;
        languageJsonObject[langCode]["strings"] = textStrings;
    }

    let data = JSON.stringify(languageJsonObject, null, 2);

    fs.writeFileSync('./data/data.json', data);
}

/* eslint-enable no-unused-vars */

module.exports.fetch = fetchCSV;
module.exports.lastUpdated = getLastUpdated;