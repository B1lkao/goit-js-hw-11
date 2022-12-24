import './sass/index.scss';
import NewAPIService from './new-service';
import axios from "axios";
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/' ;
const KEY = 'key=30951910-62deaf9663a2ad8fd5a993571';
const options = 'image_type=photo&orientation=horizontal&horizontal=true';
const perPage = 40;
let value = '';
let page = 1;

const searchFormEL = document.querySelector('.search-form');
const galleryEL = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

searchFormEL.addEventListener('submit', onSearchPhoto);
loadMore.addEventListener('click', onloadMore);


function onSearchPhoto(event) {
  event.preventDefault();
  galleryEL.innerHTML = '';
  page = 1;
    value = event.currentTarget.elements.searchQuery.value;
    get();

};

function onloadMore() {
  loadMore.classList.add('visually-hidden');
  console.log(loadMore);
  page = page + 1;
  get();
  return page
  }

async function get() {
 await axios.get(`${BASE_URL}?${KEY}&${options}&q=${value}&page=${page}&per_page=${perPage}`)
   .then(res => {
     
     if (res.data.hits.length === 0) {
       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
       return
     }

     marcap(res);

   })
   .catch(() => {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
       loadMore.classList.add('visually-hidden');
   });
 
};

function marcap(object) {
  const marcap = object.data.hits.map(info => 
          `<div class="photo-card">
            <img src="${info.webformatURL}" alt="${info.tags}" loading="lazy" />
            <div class="info">
            <div>
              <p class="info-item">
                <b>Likes</b> ${info.likes}
              </p>
              <p class="info-item">
               <b>Views</b> ${info.views}
              </p>
            </div>
            <div>
              <p class="info-item">
                <b>Comments</b> ${info.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${info.downloads}
              </p>
            </div>
            </div>
            </div>
          
        `).join('')
      galleryEL.insertAdjacentHTML('beforeend', marcap);
        console.log(galleryEL);
      loadMore.classList.remove('visually-hidden');
        console.log(loadMore);  
}