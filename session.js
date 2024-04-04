// ** Importer les modules **
const db = require('./db');


// Keep track of the current session (user)
let currSession = null;



function returnSession()
{
    return currSession;
}



function closeSession()
{
    currSession = null;
}






class Users{
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }


    info(){
        console.log(this.username);
    }

    pushUser(){
        const values = [this.username, this.password];
        return values;
    }
}






class Session{
    constructor(username) {
        this.username = username;
        this.datetime = Date.now();
    }


    info(){
        return console.log(this.username , this.datetime);
    }

    pushUser(){
        const values = [this.username, this.password];
        return values;
    }
}








/** Login a user
 * Login a user by creating an Session object
 * Will return an error 500 if it cant return data
 * @param {number} req HTTP request
 * @param {number} res HTTP response
 * @returns Login the user and redirect on login page
 */
function loginUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;


    // fetchDB is a promise --> PARAM : SQL QUERY
    let promise = db.fetchDB('SELECT username, password FROM users WHERE username = ?;', username);
    //console.log("Awaiting Promise.");

    promise.then(
        function(value) { 
            /* code if successful */ 
            //console.log(value);

            if (value.json[0]){
                const usernameDB = value.json[0].username;
                const passwordDB = value.json[0].password;

                //console.log(passwordDB + "/" + password);

                if (passwordDB === password)
                {
                    currSession = new Session(usernameDB);

                    console.log("Successfully logged in"); 
                    currSession.info();

                    res.render('login', { session: currSession })
                    return;
                }
            }

           
            //res.redirect(301, '/login');

            console.log("Wrong username or password");
            res.render('login', { message: 'Wrong username or password'})
            return;
        })
    .catch((error) => {
        //console.error("Error: ", error);
        // Handle the error and send an error response
        res.status(500).json({ error: 'Internal server error' });
    });
}



module.exports = { loginUser, returnSession, closeSession };