package in.karloyar.ecommerce.dto;

import in.karloyar.ecommerce.entity.Address;
import in.karloyar.ecommerce.entity.Customer;
import in.karloyar.ecommerce.entity.Order;
import in.karloyar.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
