import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View';

import { RES_PER_PAGE } from './config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const data = this._data;
    if (!data) return;
    //lwkd

    const numPages = Math.ceil(
      data.results.length / data.results.resultsPerPage
    );
    console.log(num);
    //Page 1 and thera are no other pages
    if (page === 1 && page === numPages) return;

    //Page 1 and thera are other pages
    if (page === 1 && page !== numPages) return ``;
    //Page middle
    //Page last
  }
  _generateMarkupStart = `
        <button class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="src/img/icons.svg#icon-arrow-left"></use>
           </svg>
           <span>Page 1</span>
         </button>
         <button class="btn--inline pagination__btn--next">
           <span>Page 3</span>
           <svg class="search__icon">
             <use href="src/img/icons.svg#icon-arrow-right"></use>
           </svg>
        </button>`;
}

export default new PaginationView();

//  <button class="btn--inline pagination__btn--prev">
//             <svg class="search__icon">
//               <use href="src/img/icons.svg#icon-arrow-left"></use>
//             </svg>
//             <span>Page 1</span>
//           </button>
//           <button class="btn--inline pagination__btn--next">
//             <span>Page 3</span>
//             <svg class="search__icon">
//               <use href="src/img/icons.svg#icon-arrow-right"></use>
//             </svg>
//           </button>
