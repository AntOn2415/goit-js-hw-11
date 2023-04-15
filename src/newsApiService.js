import axios from 'axios';
const BASE_URL = `https://pixabay.com/api/`;
const apiKey = '35375960-33ece11f0993b514084206b61';

 class NewsApiService {
  constructor(){
    this.searchQuery = "";
    this.page = 1;
  }

  xhrGallery() {
    return axios.get(`${BASE_URL}?key=${apiKey}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
    .then(response => {
      
      if (!response === 200) {
        throw new Error(error);
      }
      return response.data;
    })
    .then(data=>{
      this.incrementPege();
      return data
    }).then(data => {
      if(data.hits.length === 0) {
        throw new Error("No images found");
      }
      return data
    }).then(data => {
      const { total, totalHits, hits } = data;
      return { total, totalHits, hits };  
    });
    }

    incrementPege() {
      this.page += 1
    }
    resetPage() {
      this.page = 1
    }

    get query() {
      return this.searchQuery;
    }

    set query(newQwery) {
      return this.searchQuery = newQwery;
    }
}



export { NewsApiService };

// import axios from 'axios';
// const apiKey = '35375960-33ece11f0993b514084206b61';

// const BASE_URL = `https://pixabay.com/api/`;
// function fetchGallery(searchQuery) {

//   const params = {
//     q: `${searchQuery}`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40
//   };

//   const headers = {
//     key: `${apiKey}`
//   };
//   return axios.get(`${BASE_URL}`, { params, headers })
// .then(response => {
//   // data.hits || response.data.hits.length === 0
//   if (!response === 200) {
//     throw new Error("No images found");
//   }
//   return response.data;
// });
// }



// export { fetchGallery };

// const BASE_URL = `https://pixabay.com/api/`;
// function fetchGallery(searchQuery) {
// return axios.get(`${BASE_URL}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`)
// .then(response => {
//   if (!response === 200) {
//     throw new Error(error);
//   }
//   return response.data;
// });
// }