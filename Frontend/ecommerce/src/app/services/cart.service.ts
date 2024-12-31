import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cartitem } from '../common/cartitem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: Cartitem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  addToCart(theCartItem: Cartitem) {

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: Cartitem = undefined !;

    if (this.cartItems.length > 0) {

      //find the item in the cart based on item id

      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined)
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart quantity and cart total
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
   
  }

  // decerement Cart
  decrementQuantity(theCartItem: Cartitem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: Cartitem) {

    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id
    );

    //if found remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

  
}

