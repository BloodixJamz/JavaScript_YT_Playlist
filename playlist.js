// ** Importer les modules **
const db = require('./db');
const app = require('./app');




/** Get Songs
 * Retrieve songs infos from the database
 * Will return an error 500 if it cant return data
 * @param {number} req HTTP request
 * @param {number} res HTTP response
 * @returns Json Object containing songs infos
 */
function getSongs(req, res, session) {
    // fetchDB is a promise --> PARAM : SQL QUERY
    // ** If using fetchMusic --> Remove video_id from query **
    let promise = db.fetchDB('SELECT id, author, name, video_url, video_id FROM music_playlist;');
    //console.log("Awaiting Promise.");

    promise.then(
        function(value) { 
            /* code if successful */ 

            if (res)
            {
                //res.json(value);

                const string = JSON.stringify(value);
                const jsonObject =  JSON.parse(string);
                const results = jsonObject.json;

                console.log("Successfully retrieved music playlist");
                //console.log(results);
                res.render('playlist', { songs : results, session : session });
            }
        })
    .catch((error) => {
        //console.error("Error: ", error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal server error' });
    });
}






/** Delete Song
 * Function to delete a song from the db
 * Will return an error 500 if it cant return data
 * @param {number} req HTTP request
 * @param {number} res HTTP response
 * @returns Print Users on the route /api/users
 */
function deleteSong(req, res) {
    //console.log(req.body);

    const id = req.body.id

    // fetchDB is a promise --> PARAM : SQL QUERY
    //let promise = db.fetchDB('SELECT author, name FROM music_playlist WHERE id = ?;', id);
    let promise = db.interactDB('DELETE FROM music_playlist WHERE id = ?;', id);
    
    //console.log("Awaiting Promise.");

    promise.then(
        function(value) { 
            /* code if successful */ 

            console.log("Successfully deleted the song");
        })
    .catch((error) => {
        //console.error("Error: ", error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal server error' });
    });


    redirect(res, '/');
}








/** Get Songs
 * Retrieve the video id of a song from db
 * Will return an error 500 if it cant return data
 * @param {number} req HTTP request
 * @param {number} res HTTP response
 * @returns Print Video ID on the route
 */
function getVideoID(req, res) {
    // fetchDB is a promise --> PARAM : SQL QUERY
    let promise = db.fetchDB('SELECT id, author, name, video_id FROM music_playlist;', );
    //console.log("Awaiting Promise.");

    promise.then(
        function(value) { 
            /* code if successful */ 

            if (res)
            res.json(value);
            console.log("Successfully fetched id of videos");
        })
    .catch((error) => {
        //console.error("Error: ", error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal server error' });
    });
}



/** Insert Songs
 * Insert new song in database
 * Will return an error 500 if it cant return data
 * @param {express.Request} req HTTP request
 * @param {express.Response} res HTTP response
 * @returns New row in database
 */
async function addSong(req, res) {
    try {
        
        // Extract form data from request body
        const formData = await req.body; 
        console.log(formData);

        if (!formData || !formData.video_url)
        {
            return console.log("video_url parameter does not exists, is undefined or null.");
        }

        // Retrieving the video id from url
        const video_id = await extractIdFromURL(formData.video_url);

        const video_title = await fetchVideoTitle(video_id);
        console.log(video_title);

        // Splitting artist and song name from video title
        const infosArray = extractInfosFromTitle(video_title);

        console.log(infosArray);

        // Constructing an 
        const newSong = new SongConstructor(video_id, formData.video_url, infosArray[0], infosArray[1]);
        newSong.info();

        const songResult = db.fetchDB('SELECT video_id FROM music_playlist WHERE video_id = ?;', video_id);
        //console.log(songResult);


        if (songResult === true){
            return console.log("Song already exist in the database");
        }
        else{
            const promiseInsert = db.interactDB('INSERT INTO music_playlist (video_id, video_url, author, name) VALUES (?, ?, ?, ?)', newSong.pushSong());

            promiseInsert.then(
            function(value) { 
                if (value === true){ 
                    /* code if successful */ 
                    console.log("Values successfully inserted into database");
                }
                else{ 
                    //console.log("Error : "+ value);
                    res.status(500).send('Internal Server Error');
                }
            })
            //console.log(formData.username, formData.password);

            redirect(res, '/');
            //res.send('User created successfully');
        }
    } catch (error) {
        console.log('Error : ' + error);
    }
};



// Function to fetch video title using YouTube Data API
async function fetchVideoTitle(videoId, callback) {
    try {

        var apiKey = 'your_google_api_key';
        var apiUrl = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&part=snippet';

        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items.length > 0) {
                    var videoTitle = data.items[0].snippet.title;
                    return videoTitle;
                } else {
                    return null; // Video not found or API error
                }
            })
            .catch(error => {
                console.error('Error fetching video title:', error);
                return null;
            });
    } catch (error) {
        console.log('Error : ' + error);
    }
}



function extractIdFromURL(url) {
    //console.log(url);

    if (url)
    {
        const urlArray = url.split("?v=");

        const video_id = urlArray[1];

        return video_id;
        //console.log(video_id);
    }
}




// ref : https://stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
function extractInfosFromTitle(title) {
    //console.log(url);

    if (title)
    {
        let infosArray = [];
        const titleArray = title.split("-");

        titleArray[0] = titleArray[0].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
        titleArray[1] = titleArray[1].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');

        infosArray.push(titleArray[0].trim());
        infosArray.push(titleArray[1].trim());

        //console.log(infosArray);
        return infosArray;
    }
}



class SongConstructor {
    constructor(video_id, video_url, author, song_name){
        this.video_id = video_id;
        this.video_url = video_url;
        this.author = author;
        this.song_name = song_name;
    }
    
    info(){
        console.log(this.author +' - '+ this.song_name);
    }

    pushSong(){
        const values = [this.video_id, this.video_url, this.author, this.song_name];
        return values;
    }
}





/** Redirect
 * Redirect the user on a template
 * Will return an error 404 if no url as param or wrong one
 * @param {express.Response} res HTTP response
 * @param {string} url Url to be redirected to
 * @returns Redirect user on a template
 */
function redirect(res, url) {
    if (url){
        //setTimeout(res.redirect(301, url), 5000);
        res.redirect(301, url);
    }
    else{
        res.status(404).send('Missing URL/not found in redirection.');
    }
}



module.exports = { getSongs, addSong, getVideoID, deleteSong };