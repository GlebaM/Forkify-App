
//Import scripts/methods
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addUserRecipeView from './views/addUserRecipeView.js';

//Dependencies
import 'core-js/stable'; //Polfifilling arrays etc.
import 'regenerator-runtime/runtime'; //Polyfilling async await
import { async } from 'regenerator-runtime';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return console.log(`'Id' doesn't exist, but it's not an error`);
    recipeView.renderSpinner();

    // 1) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) Loading recipe
    await model.loadRecipe(id);

    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 2) Get search query
    const query = searchView.getQuery();
    if (!query) throw new Error('Oj');

    // 3) Load search results
    await model.loadSearchResults(query);

    // 4) Render search results
    resultsView.render(model.getSearchResultsPage(1));

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) set model.state.search.page = goToPage
  // model.state.search.page = goToPage;
  // 2) Re-render search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 3) Re-render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1)Update the recipe sevings (in state)
  model.updateServings(newServings);
  // 2) Update the recipe view
  // Re-rendering recipe
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update the recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmark
  // bookmarksView.render(model.state.bookmarks);
  controlBookmarks();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show lading spinner
    addUserRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addUserRecipeView.renderMessage();

    // Render bookmark view
    // bookmarksView.render(model.state.bookmarks);
    controlBookmarks();

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addUserRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('♨', err);
    addUserRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addUserRecipeView.addHandlerUpload(controlAddRecipe);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
init();
=======
// import icons from '../img/icons.svg';//Pacel 1
import icons from 'url:../img/icons.svg';
import 'core-js/stable'; //Polfifilling arrays etc.
import 'regenerator-runtime/runtime'; //Polyfilling async await
console.log(icons);

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return console.log(`'Id' doesn't exist, but it's not an error`);

    // 1) Loading recipe
    renderSpinner(recipeContainer);
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcf8d'
    );
    const data = await res.json();

    console.log(res);
    console.log(data);
    if (!res.ok)
      throw new Error(
        `O kurde!!! Podałeś zły adres!!! Real cause: ${data.message}, and response status is ${res.status}`
      );

    let { recipe } = data.data;
    console.log(recipe);
    recipe = {
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceURL: recipe.source_url,
      title: recipe.title,
    };
    console.log(recipe);

    // 2) Rendering recipe
    const markup =
      // prettier-ignore
      `<figure class="recipe__fig">
          <img src="${recipe.image}" crossorigin="" alt="${recipe.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

            ${recipe.ingredients.map(ing=>{
              return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>
              `;
            }).join('')}            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceURL}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
    console.log(recipe.image);
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    alert(err.message);
  }
};
// showRecipe();

//Best
['hashchange', 'load'].forEach(evt => window.addEventListener(evt, showRecipe));

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

