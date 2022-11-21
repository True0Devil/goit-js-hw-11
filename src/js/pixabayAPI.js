import axios from 'axios';

export default class PixabayAPI {
  constructor({ key, imageType, orientation, safesearch, perPage, BASE_URL }) {
    this.key = key;
    this.q = '';
    this.imageType = imageType;
    this.orientation = orientation;
    this.safesearch = safesearch;
    this.page = 1;
    this.perPage = perPage;
    this.BASE_URL = BASE_URL;
  }

  async fetchImages() {
    const images = await axios.get(
      `${this.BASE_URL}?key=${this.key}&q=${this.q}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.perPage}`
    );
    this.incrementPage();
    return images;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
