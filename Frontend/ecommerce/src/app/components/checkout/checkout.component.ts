import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { State } from '../../common/state'; 
import { Country } from '../../common/country';
import { Cartitem } from '../../common/cartitem';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Purchase } from '../../common/purchase';
import { CheckoutService } from '../../services/checkout.service';
import { OrderItem } from '../../common/order-item';
import { Order } from '../../common/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

   cartItems: Cartitem[] = [];

   totalQuantity: number = 0;

   totalPrice: number = 0;


  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  checkoutFormGroup!: FormGroup;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  countries: Country[] = [] ;
  shippingAddressCountries: Country[] = [];
  billingAddressCountries: Country[] = [];
  

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        //select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  getCountries(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getCountries().subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressCountries = data;
        }
        else{
          this.billingAddressCountries = data;
        }

        //select first item by default
        formGroup?.get('country')?.setValue(data[0]);
      }
    );
  }

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService:Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService ) { }

  ngOnInit(): void {

  

    //populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

   // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
           data => this.totalPrice = data
       );
      
   // subscribe to the cart totalQuantity
        this.cartService.totalQuantity.subscribe(
          data => this.totalQuantity = data
        );

    
      
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
     

     shippingAddress: this.formBuilder.group({
      country: new FormControl('', [Validators.required]),
      state: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required, Validators.minLength(2)]),
      street: new FormControl('',[Validators.required, Validators.minLength(2)]),
      zipCode: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(6), Validators.pattern('^[0-9]{3,6}$')])
    }),

    billingAddress: this.formBuilder.group({
      country: new FormControl('',[Validators.required]),
      state: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required, Validators.minLength(2)]),
      street: new FormControl('',[Validators.required, Validators.minLength(2)]),
      zipCode: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(6), Validators.pattern('^[0-9]{3,6}$')])
    }),

    creditCard: this.formBuilder.group({
      cardType: [''],
      nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl('',[Validators.required, Validators.minLength(16)]),
      securityCode: new FormControl('',[Validators.required, Validators.minLength(3)]),
      expMonth: [''],
      expYear: ['']

  }),

  reviewYourOrder: this.formBuilder.group({
    totalQuantity: [''],
    shippingFree: [''],
    totalPrice: ['']
    

   })

  });

  // Populate credit card months
  const startMonth: number = new Date().getMonth() + 1;
  console.log("startMonth:" + startMonth);
  this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
    data => {
      console.log("Retrieved credit card month:" + JSON.stringify(data));
      
      this.creditCardMonths = data;
    }
  );

  // Populate credit card years
  this.luv2ShopFormService.getCreditCardYears().subscribe(
    data => {
      console.log("Retrieved credit card years:" + JSON.stringify(data));
      this.creditCardYears = data;
    }
  );
   
 }

//  listCartDetails() { // start listCardDetails
    
//   // get a handle to the cart items
//   this.cartItems = this. cartService.cartItems;

//   // subscribe to the cart totalPrice
//   this.cartService.totalPrice.subscribe(
//     data => this.totalPrice = data
//   );

//   // subscribe to the cart totalQuantity
//   this.cartService.totalQuantity.subscribe(
//     data => this.totalQuantity = data
//   );

//   // compute cart total price and total quantity
//   this.cartService.computeCartTotals();

// } //end listCardDetails

 copyShippingAddressToBillingAddress(event: any) {
  //todo
  if(event.target.checked) {
    this.checkoutFormGroup.controls['billingAddress']
                                   .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
  

  this.billingAddressStates = this.shippingAddressStates;

  }else {
    // Clear the billingAddress fields
    this.checkoutFormGroup.controls['billingAddress'].reset();
  }

  }

  handleMonthsAndYears() {
    
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expYear);

    //if the current year eqauls the selected year, then start with current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    }
 
//Getter method
get firstName(){
  return this.checkoutFormGroup.get('customer.firstName');
}    

get lastName(){
  return this.checkoutFormGroup.get('customer.lastName');
}   

get email(){
  return this.checkoutFormGroup.get('customer.email');
}   

get city(){
  return this.checkoutFormGroup.get('shippingAddress.city');
}

get street(){
  return this.checkoutFormGroup.get('shippingAddress.street');
}

get zipCode(){
  return this.checkoutFormGroup.get('shippingAddress.zipCode');
}


 // Submit Method
    onSubmit() {
      console.log("Handling the submit button");
      console.log(this.checkoutFormGroup.get('customer')?.value);
      console.log("Email is " + this.checkoutFormGroup.get('customer')?.value.email);
      console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
      console.log(this.checkoutFormGroup.get('billingAddress')?.value);
      console.log(this.checkoutFormGroup.get('creditCard')?.value);
      console.log(this.checkoutFormGroup.get('reviewYourOrder')?.value);

 // Saving order Steps:
 
 // Setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalPrice = this.totalQuantity;

 // Get cart items
    const cartItems = this.cartService.cartItems;

 // Create orderItems from cartItems
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < Cartitem.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    let orderItemsInShort = cartItems.map(tempCartitem => new OrderItem(tempCartitem));


 // Setup purchase
    let purchase = new Purchase();
 
 // Populate purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
 
 // Populate purchase - Shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

 // Populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;
    

 // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItemsInShort;

 // Call Rest API: 'http://localhost:8080/checkout/purchase' via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been recieved.\nOrder tracking number: ${response.orderTrackingNumber}`)
        },
        error: err =>{
          alert(`There was an error: ${err.message}`)
        }
      }
    );

    } // Onsubmit end here

   // Go to style.css and search(ctrl+f) for "page-m" and change the padding to (10% 30% 10% 5%)
  }







  