import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { } //necesar pentru a accesa parametrii unei rute (noi trebuie sa accesam categoryId)

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { //facem subscribe la parametrii rutei date
      this.listProducts()
    });
  }

  listProducts() {
    
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

    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
