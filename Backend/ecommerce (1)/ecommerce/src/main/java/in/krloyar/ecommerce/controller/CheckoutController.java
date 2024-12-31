package in.krloyar.ecommerce.controller;

import in.krloyar.ecommerce.dto.Purchase;
import in.krloyar.ecommerce.dto.PurchaseResponse;
import in.krloyar.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/checkout")

public class CheckoutController {

    private CheckoutService cs;

    CheckoutController(CheckoutService cs) {
        this.cs = cs;
    }

    @GetMapping("/sayHello")
    public String sayHello() {
        return "Hello, Have a good day, How are you";
    }
    // EndPoint
    //http://localhost:8080/checkout/sayHello

    @PostMapping("/myName")
    public String sayMyName(@RequestParam("myName")String name) {
        return "hello " + name + "! How may i help you";
    }
    //Endpoint
    //http://localhost:8080/checkout/myName

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return cs.placeOrder(purchase);
    }
    //endpoint
    //http://localhost:8080/checkout/purchase

}
