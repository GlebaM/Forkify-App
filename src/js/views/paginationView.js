import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement = document.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      // handler();
    });
  }

  _generateMarkup() {
    // if (!this._data) return;
    const curPage = this._data.page;
    console.log(curPage);
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    console.log(`Number of pages ${numPages}`);

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
    if (curPage === 1 && curPage === numPages)
      console.log('dkftjghsekutiethdskg');
    return 'Page one and no others';
  }

  _generatePrevious(page) {
    return `
        <button class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${page - 1}</span>
         </button>`;
  }
  _generateNext(page) {
    return `
         <button class="btn--inline pagination__btn--next">
           <span>Page ${page + 1}</span>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
           </svg>
        </button>`;
  }

  // _generateMarkupStart() {}

  // _generateMarkupMiddle() {}

  // _generateMarkupLast() {}
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
