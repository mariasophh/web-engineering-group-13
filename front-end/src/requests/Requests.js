const KEY = '13997700-9d6a84e9c34046ed9782c99c9';
const BASE = 'http://localhost:8081/';
const PROXY = 'https://cors-anywhere.herokuapp.com/';

/**
 * This function will handle the GET requests to the API
 * @param {String} query 
 * @param {Function} callback 
 * @param {String} key 
 * @param {String | Optional} optional 
 */
export const fetchKeywordSuggestions = (query, callback, key, optional = null) => {
    let fetchUrl = BASE + query;
    fetchUrl += (optional && optional !== 'All genres')
        ? optional
        : '';
    
    fetch(fetchUrl)
    .then(res => res.text())
    .then(res => res ? JSON.parse(res) : null)
    .then(data => {
        if (!data) {
            callback(null, '', null);
        } else {
            if (data[0] && data[0].hasOwnProperty('TITLE')) {
                data.forEach(d => {
                    d.NAME = d.TITLE;
                });
            }
            callback(null, key, data);
        }
    })
    .catch(error => console.error(error));
}

/**
 * This function will send a request to a 3rd party API to fetch an image for a given artist
 * @param {String} query 
 * @param {Function} callback 
 */
export const getImage = (query='Michael Jackson', callback) => {
    // format the query 
    let formatted_query = query.toLowerCase().replace(/ /g, "+");

    const path = `https://pixabay.com/api/?key=${KEY}&q=${formatted_query.toLowerCase()}&image_type=photo`;
    
    fetch(PROXY + path)
    .then(res => res.text())
    .then(res => res
        ? JSON.parse(res) 
        : null
    )
    .then(data => {
        if (data && data.hits) {
            callback(null, 'image', data.hits[0].webformatURL);
        }
    })
    .catch(error => console.error(error));
};

/**
 * This function will handle the DELETE requests to the API
 * @param {Event} e 
 * @param {String} path 
 */
export const deleteRow = (e, path) => {
    e.preventDefault();

    fetch(BASE + path, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
};

/**
 * This function will handle the PUT/POST requests to the API
 * @param {Event} e 
 * @param {Object} body 
 * @param {Boolean} isCreate 
 */
export const updateCreateSong = (e, body, isCreate = false) => {
    e.preventDefault();
    // create unique id 
    const id = Date.now().toString();

    fetch(BASE + `songs/${id}`, {
        method: isCreate 
            ? 'POST' 
            : 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
};
