package in.karloyar.ecommerce.service;

import in.karloyar.ecommerce.dto.Purchase;
import in.karloyar.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase thePurchase);
}
