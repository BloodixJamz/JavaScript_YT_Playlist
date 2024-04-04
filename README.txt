** Playlist manager using Youtube iframe and Google API. **

You can add songs using the Youtube Links and they get displayed into a table below the YT iframe.


Dependancies : JavaScript express, mysql and handlebars.


- Your playlist is protected by an authentification system ( Implemented for test purpose ) but it is not separated for each users yet.

- Allow to connect a database and push songs using the youtube link into a playlist.

- Allow to listen to song added into the playlist, they will all play and stop after the last one.

- You can switch songs by clicking on the table row or using buttons below iframe.

------------------------------------------------------------------------------------------------

- You will need to change Google API key in the function 'fetchVideoTitle' of 'playlist.js' file.

- You will need to change database credentials in the function 'returnViewConn' and 'returnPrivConn' of 'db.js' file.
 