import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import './styles.css'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
    collection: document.querySelector('.breed-select'),
    catInfo: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
    error: document.querySelector('.error'),
}

const { collection, catInfo, loader, error } = refs;

loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');
  
collection.addEventListener('change', onCollectionBreed);
  
updateCollection();

function updateCollection(data) {
    fetchBreeds(data)
      .then(data => {
        loader.classList.replace('loader', 'is-hidden');
  
        let markSelect = data.map(({ name, id }) => {
          return `<option value ='${id}'>${name}</option>`;
        });
        collection.insertAdjacentHTML('beforeend', markSelect);
        new SlimSelect({
          select: collection,
        });
      })
      .catch(onFetchError);
  }

function onCollectionBreed(event) {
    // event.preventDefault()

    loader.classList.replace('is-hidden', 'loader');
    collection.classList.add('is-hidden');
    catInfo.classList.add('is-hidden');
  
    const breedId = event.currentTarget.value;

    fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      collection.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      catInfo.innerHTML = 
      `<img src="${url}" 
      alt="${breeds[0].name}" 
      width="400"/>
      <div class="box">
      <h2>${breeds[0].name}</h2>
      <p>${breeds[0].description}</p>
      <p><strong>Temperament:</strong> 
      ${breeds[0].temperament}</p>
      </div>`;
      
      catInfo.classList.remove('is-hidden');
    })
    .catch(onFetchError); 
}

function onFetchError() {
    collection.classList.remove('is-hidden');
    loader.classList.replace('loader', 'is-hidden');
  
    Notify.failure(
      'Oops! Something went wrong! Try reloading the page or select another cat breed!'
    );
  }
