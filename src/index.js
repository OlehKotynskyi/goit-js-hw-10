import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import SlimSelect from "slim-select";
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectSearch = document.querySelector('.breed-select');
const catInfoBody = document.querySelector('.cat-info');
const loaderText = document.querySelector('.loader');
const errorText = document.querySelector('.error');

const hideElement = (element) => element.classList.add('is-hidden');
const showElement = (element) => element.classList.remove('is-hidden');

hideElement(errorText);
hideElement(loaderText);

fetchBreeds()
   .then(catsItems => {
      catsItems.forEach(catItem => {
         const catItemMarkup = `<option value="${catItem.id}">${catItem.name}</option>`;
         selectSearch.insertAdjacentHTML('beforeend', catItemMarkup);
      });

      new SlimSelect({
         select: selectSearch,
         settings: {
            searchPlaceholder: 'Select a cat from the list',
         },
         events: {
            afterChange: () => selectSearch.disabled = true,
         }
      });
   })
   .catch(onError);

selectSearch.addEventListener('change', onChange);

function onChange(e) {
   const breedId = e.currentTarget.value;
   showElement(loaderText);
   hideElement(catInfoBody);

   fetchCatByBreed(breedId)
      .then(resp => {
         const { url, breeds } = resp[0];
         catInfoBody.innerHTML = `
         <img src="${url}" alt="${breeds[0].name}" width="400"/>
         <div class="box">
            <h1>${breeds[0].name}</h1>
            <p>${breeds[0].description}</p>
            <p>
               <b>Temperament:</b> ${breeds[0].temperament}
            </p>
         </div>`;
         Notify.success('Request completed successfully))');
      })
      .catch(onError)
      .finally(() => setTimeout(onFinally, 2000));
}

function onError() {
   Notify.failure('Something went wrong, oops...');
   hideElement(loaderText);
   showElement(errorText);
}

function onFinally() {
   hideElement(errorText);
   hideElement(loaderText);
   showElement(catInfoBody);
   selectSearch.removeAttribute('disabled');
}




