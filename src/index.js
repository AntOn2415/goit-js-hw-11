import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import { NewsApiService } from './newsApiService';
import { LoadMoreBtn } from './load-more-btn';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
};

const newsApiService = new NewsApiService();

const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onloadMore);

async function onFormSubmit(e) {
  e.preventDefault();

  loadMoreBtn.show();
  loadMoreBtn.disabled();
  newsApiService.resetPage();
  newsApiService.query = e.target.elements.searchQuery.value.trim();

  refs.galleryRef.innerHTML = '';

  if (!newsApiService.query) {
    loadMoreBtn.hide();
    return;
  }

  try {
    const data = await newsApiService.xhrGallery();
    if (data.hits.length === 0) {
      throw new Error('No images found');
    }
    clearGalleryList();
    loadMoreBtn.enable();
    renderGalleryList(data);
  } catch (error) {
    if (error.message === 'No images found') {
      loadMoreBtn.hide();
      onFetchError();
    }
  }
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function endOfSearchResults() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

async function onloadMore() {
  try {
    loadMoreBtn.disabled();

    const data = await newsApiService.xhrGallery();
    if (data.hits.length === 0) {
      endOfSearchResults();
      loadMoreBtn.hide();
    } else {
      renderGalleryList(data);
      loadMoreBtn.enable();
      newSimple.refresh();
      scrollToNewGallery();
    }
  } catch (error) {}
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
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
      }
    )
    .join('');
}

function renderGalleryList(data) {
  const { totalHits, hits } = data;
  const markup = createGalleryMarkup(hits);
  refs.galleryRef.innerHTML += markup;
  newSimple.refresh();

  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function clearGalleryList() {
  refs.galleryRef.innerHTML = '';
}

const newSimple = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionDelay: 250,
});

function scrollToNewGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight,
    behavior: 'smooth',
  });
}
