import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countriesListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    countriesListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        throw new Error('errorOverflow');
      }
      return data;
    })
    .then(countries => {
      if (countries.length >= 2 || countries.length <= 10) {
        renderCountriesList(countries);
      }
      return countries;
    })
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(Object.values(countries));
      }
    })
    .catch(error => {
      if (error.message === 'errorOverflow') {
      } else {
        onFetchError();
      }
    });
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function createCountriesListMarkup(fetchCountries) {
  return fetchCountries
    .map(({ flags, name }) => {
      return `<li class="country-list__item"><img class="country-flag" src="${flags.svg}"><h2 class="country-list__title">${name.official}</h2></li>`;
    })
    .join('');
}

function createCountryInfoMarkup(fetchCountries) {
  return fetchCountries
    .map(({ flags, name, capital, population, languages }) => {
      const languagesString = Object.values(languages).join(',');
      return `<div class="card-title-wrapper">
      <img class="country-flag" src="${flags.svg}" alt="${name.official}">
      <h2 class="card-title">${name.official}</h2>
    </div>
    <div class="card-body">
    <p><span class="title-arguments">Capital:</span> ${capital[0]}</p>
    <p><span class="title-arguments">Population:</span> ${population}</p>
    <p><span class="title-arguments">languages:</span> ${languagesString}</p>
    </div>`;
    })
    .join('');
}

function renderCountriesList(data) {
  const markup = createCountriesListMarkup(data);
  countriesListRef.innerHTML = markup;
  countryInfoRef.innerHTML = '';
}

function renderCountryInfo(data) {
  const markup = createCountryInfoMarkup(data);
  countryInfoRef.innerHTML = markup;
  countriesListRef.innerHTML = '';
}
