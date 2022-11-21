import PixabayAPI from './js/pixabayAPI';
import Notiflix from 'notiflix';
import axios from 'axios';

const params = {
  key: '31452557-3b0cbe15b30db98d6cb3606a9',
  imageType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  perPage: 40,
  BASE_URL: 'https://pixabay.com/api/',
};

const PixabayServiceAPI = new PixabayAPI(params);

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', createImages);

function onFormSubmit(e) {
  e.preventDefault();
  PixabayServiceAPI.q = e.currentTarget.elements.searchQuery.value;

  clearGallery();
  PixabayServiceAPI.resetPage();

  createImages();
}

function createMarkup(images) {
  return images
    .map(
      image => `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b><br> ${image.likes}
    </p>
    <p class="info-item">
      <b>Views:</b><br> ${image.views}
    </p>
    <p class="info-item">
      <b>Comments:</b><br> ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b><br> ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// function createImages() {
//   PixabayServiceAPI.fetchImages().then(images => createMarkup(images.data.hits))
//     .then(markup => refs.gallery.insertAdjacentHTML('beforeend', markup));
// }

async function createImages() {
  const images = await PixabayServiceAPI.fetchImages();
  Notiflix.Notify.success(`Hooray! We found ${images.data.total} images.`);
  const markup = await createMarkup(images.data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
