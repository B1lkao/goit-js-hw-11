import { getPhoto } from './js/getPhoto';
import markup from './js/templates/markup.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let galleryNew = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 500,
});

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.setAttribute('hidden', true);
let page = 1;

searchForm.addEventListener('submit', searchPhoto);

function searchPhoto(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  const { searchQuery } = evt.currentTarget.elements;
  const photoName = searchQuery.value.trim();
  getPhoto(photoName).then(data => {
    gallery.insertAdjacentHTML('beforeend', markup(data.hits));
    galleryNew.refresh();
    if (data.total === 0 || photoName === '') {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (data.total !== 0 && data.hits.length < 40) {
      loadMore.setAttribute('hidden', true);
      setTimeout(() => {
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      }, 300);
      setTimeout(() => {
        Notify.info(
          `"We're sorry, but you've reached the end of search results."`
        );
      }, 1500);
    } else if (data.total > 40) {
      loadMore.removeAttribute('hidden');
      setTimeout(() => {
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      }, 300);
    }
  });
}

loadMore.addEventListener('click', onLoad);

function onLoad() {
  page += 1;
  getPhoto(searchForm.searchQuery.value.trim(), page).then(data => {
    gallery.insertAdjacentHTML('beforeend', markup(data.hits));
    galleryNew.refresh();
    smoothScroll();
    if (data.hits.length < 40 || page === 13) {
      loadMore.setAttribute('hidden', true);
      setTimeout(() => {
        Notify.info(
          `"We're sorry, but you've reached the end of search results."`
        );
      }, 1500);
    }
  });
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}