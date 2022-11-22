import PixabayAPI from './js/pixabayAPI';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const params = {
  key: '31452557-3b0cbe15b30db98d6cb3606a9',
  imageType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  perPage: 40,
  BASE_URL: 'https://pixabay.com/api/',
};

const imgService = new PixabayAPI(params);

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.disabled = 'disabled';

const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', createImages);
refs.gallery.addEventListener('click', onGalleryClick);

function onGalleryClick(e) {
  e.preventDefault();
  lightbox.open();
}

function onFormSubmit(e) {
  e.preventDefault();
  imgService.q = e.currentTarget.elements.searchQuery.value;
  e.currentTarget.elements.searchQuery.value = '';

  clearGallery();
  imgService.resetPage();

  createImages();
  refs.loadMoreBtn.disabled = null;
}

function createMarkup(images) {
  return images
    .map(
      image => `<div class="photo-card">
  <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
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

async function createImages() {
  const images = await imgService.fetchImages();

  if (images.data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = await createMarkup(images.data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  if (refs.gallery.children.length === images.data.totalHits) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  } else {
    Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
  }
}
