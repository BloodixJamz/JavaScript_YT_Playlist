// Importer les modules
//const { promises } = require("dns");
const mysql = require("mysql");


// Check if the config file exists
let configFile = null;

try {
    // Config contains credentials and api keys
    configFile = require('./config');
} catch (error) {
    console.log('You need to create a config.js file or change the credentials directly in the functions in file : db.js');
}



// **** All the documentation was done on the 3/17/2024 ****



/** Reading Connexion Handler
 * Create a connexion to db with read only rights and returns it for manipulation
 * Will throw a new error if connexion is not successful
 * @returns {mysql.Connection} The connexion object ready to be manipulated
 */
function returnViewConn() {
    try {

        // **** Database credentials here (Read only) ****

        const conn = mysql.createConnection({
            user: configFile.config.userView,
            password: configFile.config.passwordView,
            server: configFile.config.server,
            database: configFile.config.database
        });

        // Connect to database
        conn.connect((err) => {
            if (err) 
            {
                return console.error('Error connecting to MySQL database: ' + err.stack);
            }

            return console.log('Connected to MySQL database as id ' + conn.threadId);
        });

        return conn;
    } 
    catch (error) {
        return console.error('Error connecting to MySQL database: ' + error);
    }
}




/** Privileges Connexion Handler
 * Create a connexion to db with all rights and returns it for manipulation
 * Will throw a new error if connexion is not successful
 * @returns {mysql.Connection} The connexion object ready to be manipulated
 */
function returnPrivConn() {
    try {

        // **** Database credentials here (Privileges) ****
        const conn = mysql.createConnection({
            user: configFile.config.userPriv,
            password: configFile.config.passwordPriv,
            server: configFile.config.server,
            database: configFile.config.database
        });

        // Connect to database

        conn.connect((err) => {
            if (err) 
            {
                return console.error('Error connecting to MySQL database: ' + err.stack);
            }

            return console.log('Connected to MySQL database as id ' + conn.threadId);
        });

        return conn;
    } 
    catch (error) {
        return console.error('Error connecting to MySQL database: ' + error);
    }
}




/** Connexion Closer
 * Close an open connexion to db
 * Will throw a new error if closing connexion is not successful
 * @param {mysql.Connection} conn The connexion object ready to be closed
 * @returns {console.log} Will log if either successful or Error
 */
function closeConn(conn) {
    // Close connection
    conn.end((err) => {
        if (err) {
            return console.error('Error closing MySQL connection: ' + err.stack);
        }

        return console.log('MySQL connection closed.');
    });
}








/** Database Fetcher
 * Allow to fetch data from a database
 * Will throw an error in the promise if not successful
 * @param {string} sql The SQL query which represent the data to be manipulated
 * @returns {promise} Return a promise containing either the data or an error
 */
function fetchDB(sql, values) {
    return new Promise(function(myResolve, myReject) {

        const conn = returnViewConn();
            
        try {
        // Créer l'object de la requête
            conn.query(sql, values, function (err, records) {

          
                if (err)
                {
                    console.log(err.stack);
    
                    closeConn(conn);
                    myReject(err);  // when error
                }
                
                const data = { json: records };
    
                closeConn(conn);
                myResolve(data); // when successful
            })
        } catch (error) {
            closeConn(conn);
            myReject(error);
        }
    });
}







// ref : https://stackoverflow.com/questions/41533993/cleancode-try-catch-in-promise
// ref : https://stackoverflow.com/questions/62576296/how-to-insert-or-update-into-database-in-expressjs


/** Database Inserter
 * Allow to insert data into a database
 * Will throw an error in the promise if not successful
 * @param {string} sql The SQL query which represent the data to be manipulated
 * @returns {promise} Return a promise containing either true or an error
 */
function interactDB(sql, values) {
    return new Promise(function(myResolve, myReject) {
        const conn = returnPrivConn();

        try {
            // Créer l'object de la requête
            conn.query(sql, values, (err, results) => {
           
                if (err) {
                    //console.error('Error executing query: ', err);
                    closeConn(conn);
                    myReject(err);
                }
                
               
                //console.error('Insertion : '+ values);
                closeConn(conn);
                myResolve(true); // when successful
                
            })
        } catch (error) {
            closeConn(conn);
            myReject(error);
        }
    });
}


module.exports = { fetchDB, interactDB };