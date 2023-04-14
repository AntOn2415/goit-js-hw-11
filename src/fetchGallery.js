import axios from 'axios';
const apiKey = '35375960-33ece11f0993b514084206b61';

const BASE_URL = `https://pixabay.com/api/`;
function fetchGallery(searchQuery) {
return axios.get(`${BASE_URL}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`)
.then(response => {
  // data.hits || response.data.hits.length === 0
  if (!response === 200) {
    throw new Error("No images found");
  }
  return response.data;
});
}



export { fetchGallery };
