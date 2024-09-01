import View from "./View";
import icons from '../../img/icons.svg';
import previewRecipieView from "./previewRecipieView";
class RecipeResultsView extends View {
    _data;
    _ErrorMsg = 'Sorry We cant find the recipie Here ';
    _parentItem = document.querySelector('.results');

    _generateMarkup(){
        return this._data.map(data => previewRecipieView.render(data,false)).join('');
    }

    
    // ^ used same code in the previewReceipeViewer script Above code is very important in order make code flexible render writes the innerHTML but
    // ^ we want here to get the html code so we stops the code at some point using another parameter called false as render and writes the  markup value

    // _generateResult(data){
    //   const id = window.location.hash.slice(1);
    //     return `
    //     <li class="preview">
    //         <a class="preview__link ${ id === data.id ? "preview__link--active" :' '}" href="#${data.id}">
    //           <figure class="preview__fig">
    //             <img src="${data.image}" alt="${data.title}" />
    //           </figure>
    //           <div class="preview__data">
    //             <h4 class="preview__title">${data.title}</h4>
    //             <p class="preview__publisher">${data.publisher}</p>
    //             <div class="preview__user-generated">
    //             //   <svg>
    //             //     <use href="${icons}#icon-user"></use>
    //             //   </svg>
    //             </div>
    //           </div>
    //         </a>
    //       </li>
    //     `
    // }
}
export default new RecipeResultsView();