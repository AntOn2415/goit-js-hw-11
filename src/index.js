
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';
import {fetchGallery} from "./fetchGallery";

const refs = {
  form: document.querySelector('.search-form'),
  // input: document.querySelector('input'),
  galleryRef: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target[0].value.trim();

  if (!searchQuery) {
    refs.galleryRef.innerHTML = '';
    return;
  }

fetchGallery(searchQuery)
.then(data => {
  const { total, totalHits, hits } = data;
  return { total, totalHits, hits };
})
  .then(data => {
    return renderGalleryList(data);
  })
  .catch(
    onFetchError)
}

function onFetchError() {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function createGalleryMarkup(images) {
  return images
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      // total, totalHits,
      return`
      <div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}" target="_parent">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
    })
    .join("");
}

// function renderGalleryList(data) {
//   const markup = createGalleryMarkup(data);
//   refs.galleryRef.innerHTML = markup;
// };

function renderGalleryList(data) {
  const { total, totalHits, hits } = data;
  const markup = createGalleryMarkup(hits);
  refs.galleryRef.innerHTML = markup;

  // Виведення загальної кількості знайдених зображень та загальної кількості відповідей
  Notiflix.Notify.info(`Total: ${totalHits} images found. Total hits: ${total}`);
}

new SimpleLightbox(".gallery a", {
  captions: true,
  captionsData: "alt",
  captionDelay: 250,
});


