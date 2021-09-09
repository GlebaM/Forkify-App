//Import scripts/methods
import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

//Dependencies
import 'core-js/stable'; //Polfifilling arrays etc.
import 'regenerator-runtime/runtime'; //Polyfilling async await

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return console.log(`'Id' doesn't exist, but it's not an error`);
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
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
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
