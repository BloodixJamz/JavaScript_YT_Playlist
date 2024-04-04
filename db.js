// Importer les modules
//const { promises } = require("dns");
const mysql = require("mysql");




// **** All the documentation was done on the 3/17/2024 ****



/** Reading Connexion Handler
 * Create a connexion to db with read only rights and returns it for manipulation
 * Will throw a new error if connexion is not successful
 * @returns {mysql.Connection} The connexion object ready to be manipulated
 */
function returnViewConn() {
    // Database credentials here (Read only)
    const conn = mysql.createConnection({
        user: 'your_username',
        password: 'your_password',
        server: 'localhost',
        database: 'your_db_name'
    });

    // Se connecter a la base de donnée
    conn.connect((err) => {
        if (err) 
        {
            //return console.error('Error connecting to MySQL database: ' + err.stack);
            throw new Error('Error connecting to MySQL database'); 
        }

        return console.log('Connected to MySQL database as id ' + conn.threadId);
    });

    return conn;
}




/** Privileges Connexion Handler
 * Create a connexion to db with all rights and returns it for manipulation
 * Will throw a new error if connexion is not successful
 * @returns {mysql.Connection} The connexion object ready to be manipulated
 */
function returnPrivConn() {
    // Database credentials here (Privileges)
    const conn = mysql.createConnection({
        user: 'your_username',
        password: 'your_password',
        server: 'localhost',
        database: 'your_db_name'
    });

    // Se connecter a la base de donnée
    conn.connect((err) => {
        if (err) 
        {
            //return console.error('Error connecting to MySQL database: ' + err.stack);
            throw new Error('Error connecting to MySQL database'); 
        }

        return console.log('Connected to MySQL database as id ' + conn.threadId);
    });

    return conn;
}




/** Connexion Closer
 * Close an open connexion to db
 * Will throw a new error if closing connexion is not successful
 * @param {mysql.Connection} conn The connexion object ready to be closed
 * @returns {console.log, Error} Will either log if successful or throw an Error if not
 */
function closeConn(conn) {
    // Fermer la connection
    conn.end((err) => {
        if (err) {
            //return console.error('Error closing MySQL connection: ' + err.stack);
            throw new Error('Error closing MySQL connection'); 
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