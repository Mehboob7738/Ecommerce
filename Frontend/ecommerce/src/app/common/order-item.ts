import { Cartitem } from "./cartitem"

export class OrderItem {

    public imageUrl!: string;
    public unitPrice!: number;
    public quantity!: number;
    public productId!: number

    constructor(cartItem: Cartitem){

        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;

    }

}
        
     

    



    

