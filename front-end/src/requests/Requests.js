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
    const path = `https://pixabay.com/api/?key=${KEY}&q=${query.toLowerCase()}&image_type=photo`;
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
