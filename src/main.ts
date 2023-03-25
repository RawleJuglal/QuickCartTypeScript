import './style.css';
import { initializeApp } from '@firebase/app';
import { getDatabase, ref, push, onValue, remove } from "@firebase/database"
import { clearInputEl, clearShoppingListEl } from './functions';

const appSettings: {
  databaseURL:string;
} = {
  databaseURL: 'https://realtime-database-a7c40-default-rtdb.firebaseio.com/',
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingListTypeScript');

const shoppingCartInputEl = document.querySelector<HTMLInputElement>('#grocery-input');
if(!shoppingCartInputEl)throw new ReferenceError(`shopping cart input doesn't exist`)
const shoppingCartBtnEl = document.querySelector<HTMLElement>('#add-button');
if(!shoppingCartBtnEl)throw new ReferenceError(`shopping cart button doesn't exist`);
const shoppingListEl = document.querySelector<HTMLElement>('#shopping-list');
if(!shoppingListEl)throw new ReferenceError(`shopping list doesn't exist`);


onValue(shoppingListInDB, (snapshot: any)=>{
  if(snapshot.exists()){
    let shoppingListArray = Object.entries(snapshot.val());
    clearShoppingListEl(shoppingListEl)
    shoppingListArray.map((item:string[]) => {
      addItemToCart(shoppingListEl, item)
    })
  } else {
    shoppingListEl.innerHTML = `<p>No Items here...yet</p>`
  }  
})

function addItemToCart(element:HTMLElement, item: string[]){
  let newEl = document.createElement('li');
  newEl.classList.add('list-item');
  let groceryItem : string = item[0];
  newEl.textContent = item[1];
  newEl.addEventListener('dblclick',()=>{
    let exactLocationOfItemInBD = ref(database, `shoppingListTypeScript/${groceryItem}` )
  
    remove(exactLocationOfItemInBD);
  })
  element.append(newEl)
}

shoppingCartBtnEl.addEventListener('click',()=>{
  let inputValue: string = shoppingCartInputEl.value;
  if(inputValue){
    push(shoppingListInDB, inputValue);
  }
  clearInputEl(shoppingCartInputEl);
})