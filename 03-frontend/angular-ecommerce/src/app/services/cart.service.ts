import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //subject = subclass of Observable, use subject to publish events in our code
  //that events will be sent to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); 

  storage: Storage = sessionStorage; //referinta la stocarea sesiunii browserului web (acces gratuit) (cosul se reseteaza dupa ce inchid browserul)
  //storage: Storage = localStorage; //referinta la stocarea sesiunii browserului web (acces gratuit) (se pastreaza datele din cos mereu)

  constructor() {
    //read the data from the storage (from browser web)
    let data = JSON.parse(this.storage.getItem('cartItems')); // Read JSON string and convert to object, cartItems = key

    if(data != null) {
      this.cartItems = data;

    //compute totals based on the data that is read from storage
    this.computeCartTotals();
    }

   }

  addToCart(theCartItem: CartItem) {
    
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
      //find the item in the cart based on the item id

    existingCartItem = this.cartItems.find( tempCartItem => (tempCartItem.id === theCartItem.id) );
         
    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
  }

  if(alreadyExistsInCart) {
    //increment the quantity
    existingCartItem.quantity++;
  }
  else {
    //just add the itme to the array
    this.cartItems.push(theCartItem);
  }

  //compute cart total price and total quantity
  this.computeCartTotals();
 } 

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
      //publish the new values with next...all subscribes will recieve the new data
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);
   
      //log cart data jus for debubugginf purposes
      this.logCartData(totalPriceValue, totalQuantityValue);

      //persist the cart data
      this.persistCartItems();
  }

  persistCartItems() {
    //convert object to JSON string because the API only work for strings (key and value)
    // key = 'cartItems', value = JSON.stringify(this.cartItems) and that both are string
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); 
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    
    //first of all we need to find theCartItem
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id); // this return the index of theCartItem or -1 if not found it
    
    //if found, remove the item from the array cartItem at the given index
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1); //remove 1 item with itemIndex id.

      this.computeCartTotals(); //recalculam suma si cantitatea totala
    }
  }
}
