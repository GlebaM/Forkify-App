import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // if (!this._data) return;
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1 and thera are other pages
    if (curPage === 1 && numPages > 1) {
      this._clear();
      return this._generateNext(curPage);
    }
    // // Middle page
    if (curPage > 1 && curPage < numPages) {
      this._clear();
      return [
        this._generatePrevious(curPage),
        this._generateNext(curPage),
      ].join('');
    }

    // // Last page
    if (curPage === numPages && numPages > 1) {
      this._clear();
      return this._generatePrevious(curPage);
    }

    //Page 1 and thera are no other pages
    if (curPage < 2 && curPage === numPages) return '';
  }

  _generatePrevious(page) {
    return `
        <button data-goto='${
          page - 1
        }' class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${page - 1}</span>
         </button>`;
  }
  _generateNext(page) {
    return `
         <button data-goto='${
           page + 1
         }' class="btn--inline pagination__btn--next">
           <span>Page ${page + 1}</span>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
           </svg>
        </button>`;
  }
}

export default new PaginationView();
