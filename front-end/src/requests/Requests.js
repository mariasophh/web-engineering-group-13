const KEY = '13997700-9d6a84e9c34046ed9782c99c9';
const BASE = 'http://localhost:8081/';
const PROXY = 'https://cors-anywhere.herokuapp.com/';

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
            callback(null, key, data);
        }
    })
    .catch(error => console.error(error));
}

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
    .catch(error => console.error(error));;
}

export const deleteRow = (e, path) => {
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
}
