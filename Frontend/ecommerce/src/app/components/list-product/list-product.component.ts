import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { Cartitem } from '../../common/cartitem';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  // new properties for pagination 

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private ps: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.getAllProducts();
     });
  }

  getAllProducts(){

    const hasKeyword: boolean = this.route.snapshot.paramMap.has('keyword');

    if(hasKeyword){
      this.searchByKeyword();
     }else{
      //default product by category
      this.productsByCategory();
     }
    }

    
  productsByCategory() {
    //check parameter 'id' is available
    const hascategoryId = this.route.snapshot.paramMap.has('id');
    if(hascategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId = 1;
   }

   // check if we have different category than previous
   if(this.previousCategoryId != this.currentCategoryId){
    this.thePageNumber = 1;
   }

   //update previous category id 
   this.previousCategoryId = this.currentCategoryId;

   //call new method: getProductListPaginate
   this.ps.getProductListPaginate(this.thePageNumber - 1,
                                  this.thePageSize,
                                  this.currentCategoryId)
                                  .subscribe(
                                    data =>{
                                      this. products = data._embedded.products;
                                      this.thePageNumber = data.page.number + 1;
                                      this.thePageSize = data.page.size;
                                      this.theTotalElements = data.page.totalElements;
                                    }
                                  );

   

    // this.ps.getProducts(this.currentCategoryId).subscribe(
    //   data => {
         
    //     this.products = data;
    //   }
    // );
   }
    

    searchByKeyword() {
      //only display list of search prodcuts
      const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

      this.ps.searchProducts(theKeyword).subscribe(
        data =>{
          this.products = data;
        }
      );
    }

    //Adding select size feature for pagination

    updatePageSize(pageSize: String) {
      this.thePageSize = +pageSize;
      this.thePageNumber = 1;
      this.getAllProducts();

    }

    addToCart(theProduct: Product) {
      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

      const theCartItem = new Cartitem(theProduct);

      this.cartService.addToCart(theCartItem);
    }

    

  
  


  // btnClicked(){
  // console.log("Hey, Don't push me!");
  // }

  // btnTapped(){
  // console.log("Data deleted successfully")
  // }

  // btnSubmit(){
  // console.log("Data Submitted Successfully")
  // }
}
