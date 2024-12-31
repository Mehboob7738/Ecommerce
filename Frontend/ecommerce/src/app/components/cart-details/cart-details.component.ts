import { Component, OnInit } from '@angular/core';
import { Cartitem } from '../../common/cartitem';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {

  cartItems: Cartitem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {

    this.listCartDetails();
    
  }

  listCartDetails() { // start listCardDetails
    
    // get a handle to the cart items
    this.cartItems = this. cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();

  } //end listCardDetails

  incrementQuantity(theCartItem: Cartitem) {
    this.cartService.addToCart(theCartItem);
  } // end incrementQuantity

  decrementQuantity(theCartItem: Cartitem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  removeQuantity(theCartItem: Cartitem) {
    this.cartService.remove(theCartItem);
  }

}
