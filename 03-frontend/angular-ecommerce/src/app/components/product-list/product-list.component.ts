import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination:
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;

  previousKeyword: string = null;
  
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { } //necesar pentru a accesa parametrii unei rute (noi trebuie sa accesam categoryId)

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { //facem subscribe la parametrii rutei date
      this.listProducts()
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    //if we have a different keyword than previous => set thePageNumer = 1
    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`Keyword=${theKeyword}, thePageNumer=${this.thePageNumber}`);

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
        //check if "id" parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id') ///snapshot = state of the route at this given moment in time

        if(hasCategoryId) {
          //get the "id" param string and convert it to a number using the "+" symbol
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id'); //paraneter value is returned as a string and we conert it to a number using +
        }
        else {
          //not category id available => default to category id 1
          this.currentCategoryId = 1;
        }

        //Check if we have a different category than previous
        //Note: angular will reuse a component if it is currently being viewd
        //if we have a different category id than previous then we need to set thePageNumber back to 1
        if(this.previousCategoryId != this.currentCategoryId) {
          this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
        // now get the products for the given category id
        this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                                   this.thePageSize,
                                                   this.currentCategoryId)
                                                   .subscribe(this.processResult());
  }

  //We have:
  //on the left-hand side: properties defined in this class 
  //over the right-hand side: data that came back from the Spring Data Rest JSON.
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
