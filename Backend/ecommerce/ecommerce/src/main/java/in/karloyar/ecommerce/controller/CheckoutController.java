package in.karloyar.ecommerce.controller;

import in.karloyar.ecommerce.dto.Purchase;
import in.karloyar.ecommerce.dto.PurchaseResponse;
import in.karloyar.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public class
CheckoutController {

    private CheckoutService cs;

    CheckoutController(CheckoutService cs) {
        this.cs = cs;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Have a good day, How may i help you";
    }

    @PostMapping("/myName")
    public String sayMyName(@RequestParam("myName") String name) {
        return "Hello "+ name +"! How may i help you";
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        return cs.placeOrder(purchase);
    }
}

// endpoint: localhost:8080/checkout/hello
// endpoint: localhost:8080/checkout/myName
// endpoint: localhost:8080/checkout/purchase
