# general information about the project with instructions on how to run the code
This repository contains the project for group 13 (Maria Sophia Stefan s3413896 & Anda-Amelia Palamariuc s3443817).

# ports
The backend listens to port 8081.
The frontend listens to port 3000.

# documents
The final version of the documents can be found in the documents directory, updated in accordance to the latest received feedback after each milestone deadline.

# backend
The back-end directory contains the API and the code that executes queries on the database.
The back-end runs using "npm install" (to install all dependencies) and "npm start".

# database
The database itself is not included in the repository, as it needs to be created with the command "sqlite3 sqlite.db" in the root directory of the back-end directory.

After this, the database will be populated with the initial values by executing the curl command "curl -X POST http://localhost:8081/populateDB".

# frontend
The front-end directory contains the front end code with the components, css file and the requests file.

The front-end runs using "npm install" (to install all dependencies) and "npm start".
