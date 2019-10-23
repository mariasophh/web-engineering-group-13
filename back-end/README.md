# files
The files found in this directory are:
Database.js : contains all the functions that query the database
Server.js : defines the API routes and configurations for requests parsing
Utilities.js : helper functions, together with functions that handle the passed responses (together with the codes)

router/Artists.js : all the functions concerning the artists resource
router/Releases.js : all the functions concerning the releases resource
router/Songs.js : all the functions concerning the songs resource

/assets folder (not on github due to size) should contain the provided files music.json and song_titles.txt

# database
The database itself is not included in the repository on github, as it needs to be created with the command "sqlite3 sqlite.db" in the root directory of the back-end directory.

After this, the database will be populated with the initial values by executing the curl command "curl -X POST http://localhost:8081/populateDB".

# instructions to run
To run the API use the command "npm install" (to install all the dependencies) and "npm start".

The backend listens to port 8081.
