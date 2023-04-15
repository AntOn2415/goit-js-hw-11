
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';
import {NewsApiService} from "./newsApiService";

const refs = {
  form: document.querySelector('.search-form'),
  galleryRef: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService()
console.log("🚀 ~ file: index.js:17 ~ newsApiService:", newsApiService)

refs.form.addEventListener('submit', onFormSubmit);
refs.button.addEventListener('click', onloadMore)

function onFormSubmit(e) {
  e.preventDefault();

  newsApiService.resetPage();
  newsApiService.query = e.target.elements.searchQuery.value.trim();

  if (!newsApiService.query) {
    refs.galleryRef.innerHTML = '';

    return;
  }

  newsApiService.xhrGallery()
  .then(data => {
    clearGalleryList()
    return renderGalleryList(data);
  })
  .catch(error => {
    if (error.message === "No images found") {
      onFetchError()
    } 
  });
}

function onFetchError() {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function onloadMore(){
  newsApiService.xhrGallery().then(renderGalleryList);
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

function renderGalleryList(data) {
  const { total, totalHits, hits } = data;
  const markup = createGalleryMarkup(hits);
  refs.galleryRef.innerHTML = markup;

  Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
}
function clearGalleryList() {
  refs.galleryRef.innerHTML = '';
}
new SimpleLightbox(".photo-card a", {
  captions: true,
  captionsData: "alt",
  captionDelay: 250,
});


