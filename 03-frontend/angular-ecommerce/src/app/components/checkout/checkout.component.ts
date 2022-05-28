import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ECommerceFormService } from 'src/app/services/e-commerce-form.service';
import { ECommerceValidators } from 'src/app/validators/e-commerce-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  
  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  storage: Storage = sessionStorage;

  //initialize the Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private eCommerceFormService: ECommerceFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    //setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    //read the usr's email address from browsr storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ECommerceValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

  /*
    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    
    this.eCommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    
    //populate credit card years
    this.eCommerceFormService.getCreditCardYear().subscribe(
      data => { 
        console.log("Retrived credit card year: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
  */

    //populate countries
    this.eCommerceFormService.getCountries().subscribe(
      data => {
        console.log("Retrived countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {
    
    // get a handlee to stripe elements
    var elements = this.stripe.elements();

    // create a card element and hide the zip=code field
    this.cardElement = elements.create('card', { hidePostalCode: true});

    // add an instance of card UI component into the card-element div
    this.cardElement.mount('#card-element');

    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event) => {
      
      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
  }

  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartService.totalQuantity
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStatet() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); } 

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStatet() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }


  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
           .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix for states
      this.billingAddressState = this.shippingAddressState;
      }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for states
      this.billingAddressState = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); //touching all fields triggers the display of the error messages
      return;
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    
    /*
    metoda 1: (long way)
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    //metoda 2: (short way)
    let orderItems : OrderItem[] = cartItems.map(temmpCartItem => new OrderItem(temmpCartItem));

    //set up purchase
    let purchase = new Purchase();
  
    //populate purchase - customer 
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    //if valid form then
    // - create payment intent
    // - confirm card payment 
    // -place order

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method : {
                card: this.cardElement,
                billing_details : {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false})
            .then(function(result) {
              if(result.error) {
                // inform the customer there was an error
                alert(`A aparut o erare: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                //call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    alert(`Comanda ta a fost inregistrata.\n Numarul comenzii este: ${response.orderTrackingNumber}`);

                    //reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: err => {
                    alert(`A aparut o eroare: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            }.bind(this));
        }
      );
    } else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
 }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    
    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the product page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.eCommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.eCommerceFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressState = data;
        }
        else {
          this.billingAddressState = data;
        }

        //select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );

  }
}
