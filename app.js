// ref : https://www.digitalocean.com/community/tutorials/nodejs-express-basics

// Commande : node app.js


// Import dependancies
const express = require("express");
const app = express();

const { engine } = require("express-handlebars");

//const db = require('./db');
const playlist = require('./playlist');
const session = require('./session');


// Init Handlebars for templates
app.engine("handlebars", engine());
app.set("view engine", "handlebars");



// Define templates folder
app.set("views", "./views");




// * ref : https://stackoverflow.com/questions/45395947/what-is-the-proper-way-of-referencing-css-and-js-files-with-handlebars

// Define folder for statics files
app.use(express.static("static"));


// Middleware to parse incoming form data
// ** POST form et fetch ne fonctionne pas sans ce bout de code.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// Define app routes

//*********************** PLAYLIST *******************************

app.get('/', async (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();


    if (currSession){
        //console.log(currSession);
        //const results = await playlist.getSongs(req, res, currSession);
        //res.render('playlist', { songs : results, session : session });

        playlist.playlistRedirect(res, null);
    }
    else{
        //console.log(currSession);
        res.render('login');
    }
});


// OLD METHOD OF RETRIEVING SONGS
/*
app.get('/api/playlist', (req, res) => {
    playlist.getSongs(req, res);
});*/



app.get('/api/fetch_video_id', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();

    if (currSession){
        //console.log(currSession);
        playlist.getVideoID(req, res);
    }
});



app.post('/api/add_song', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();

    if (currSession){
        //console.log(currSession);
        playlist.addSong(req, res);
    }
});



app.post('/api/delete_song', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();

    if (currSession){
        //console.log(currSession);
        playlist.deleteSong(req, res);
    }
});






//*********************** LOGIN AND SESSIONS *******************************

app.get('/login', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();


    if (currSession){
        //console.log(currSession);
        res.render('login', { session: currSession });
    }
    else{
        //console.log(currSession);
        res.render('login');
    }
});



app.get('/logout', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();

    if (currSession){
        //console.log(currSession);
        session.closeSession();
    }

    //console.log(currSession);
    res.render('login');
});


app.post('/api/login', (req, res) => {
    // Get the current session, if not it returns null
    const currSession = session.returnSession();


    if (!currSession){
        //console.log(currSession);
        session.loginUser(req, res);
    }
});


// Démarrer le serveur node
app.listen(5000, '0.0.0.0', () => console.log('Serveur démarré sur le port 5000.'));
