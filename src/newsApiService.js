import axios from 'axios';
const BASE_URL = `https://pixabay.com/api/`;
const apiKey = '35375960-33ece11f0993b514084206b61';
class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async xhrGallery() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${apiKey}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );
      const data = response.data;
      this.incrementPage();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQwery) {
    return (this.searchQuery = newQwery);
  }
}

export { NewsApiService };
