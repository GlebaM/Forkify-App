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
