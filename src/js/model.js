import { Value } from "sass";
import { API_KEY , KEY, PER_PAGE} from "./config";
import {AJAX} from "./helper";

export const state = {
     recipe : {},
     search :{
      query : '',
      results :[],
      requirePerPage : PER_PAGE,
      page : 1,
     },
     bookmarks :[]
}

const getObjectRecipe = function(data){
  const {recipe} = data.data;
  return {
    id:recipe.id,
    title : recipe.title,
    publisher : recipe.publisher,
    sourceUrl : recipe.source_url,
    image : recipe.image_url,
    servings : +recipe.servings,
    cookingTime : +recipe.cooking_time,
    ingredients :recipe.ingredients,

    ...(recipe.key && {key : recipe.key}),
  }
}

export const loadRecipie =  async function(id){
    try{

    const data = await AJAX(`${API_KEY}/${id}?key=${KEY}`);
      
    // Calling it and storing it so that below code can get access to this using async function ;
    
    state.recipe = getObjectRecipe(data);

    if(state.bookmarks.some(bookmark => bookmark.id===id)){
      state.recipe.bookmark = true;
    }
    else{
      state.recipe.bookmark = false;
    }
}
catch(err){
    console.error(`${err} 💋💋`);
    throw err;
}

}

export const searchRecipe =  async function(item){
  try{
  
    console.log(item); 
    const data = await AJAX(`${API_KEY}?search=${item}&key=${KEY}`);
    
    state.search.query = item;
    
    const {recipes}  = data.data;
    
    state.search.results = recipes.map((item) => ({
      id: item.id,
      image: item.image_url,
      publisher: item.publisher,
      title: item.title,
      ...(item.key && {key : item.key}),
    }))

    state.search.page = 1; 
    // bug to get the value back to the page - 1;

  }catch(err){
    throw err;
  }
}

// ^ Setting the arr values to be fixed -> implies proper arrangment of the section

export const getRequiredPerPage = function(page = state.search.page ){
  state.search.page = page;
  // IMP to store the value -> 
  const start = (page - 1)* state.search.requirePerPage;
  const last = (page)*state.search.requirePerPage;

  return state.search.results.slice(start , last);
}

export const getServingSize =  function(numServ){
  state.recipe.ingredients.forEach((ing)=>{
    ing.quantity = ing.quantity * numServ / state.recipe.servings;
  });

  state.recipe.servings  = numServ;
}
const parseStorage = function(){
  localStorage.setItem('bookmark',JSON.stringify(state.bookmarks));
}


export const updateBookmark = function(recipe){
  state.bookmarks.push(recipe);

  if(recipe.id === state.recipe.id) state.recipe.bookmark = true;

  parseStorage();
}

export const deleteBookmark = function(id){

  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index,index+1);

  if(id === state.recipe.id) state.recipe.bookmark = false;

  parseStorage();
}

export const sendRecipe = async function(values){
  try{
  const data =  Object.entries(values);

  const ingredients = data.filter(el => el[0].startsWith('ingredient') && el[1]!=='')
                      .map(el=>{
                        const iterator = el[1].split(',').map(el => el.trim());

                        if(iterator.length!==3) throw new Error('Wrong Format is take Placed');

                        const [quantity,unit,description] = iterator;
                        return {quantity:quantity?+quantity:null  ,unit, description };
                      });


    const recipe = {
      title : values.title,
      publisher : values.publisher,
      source_url : values.source_url,
      image_url : values.image_url,
      servings : +values.servings,
      cooking_time : +values.cooking_time,
      ingredients,
    }

    const sendTo = await AJAX(`${API_KEY}?key=${KEY}`, recipe);
    
    state.recipe = getObjectRecipe(sendTo);

    updateBookmark(state.recipe);
    // Sends the data of the sent api call to the state.recepie api 
      
  }
  catch(err){
    throw err;
  }

}

const init = function(){
  const bookmark = localStorage.getItem('bookmark'); 
  if(!bookmark) return;
  state.bookmarks = JSON.parse(bookmark);
}
init();

