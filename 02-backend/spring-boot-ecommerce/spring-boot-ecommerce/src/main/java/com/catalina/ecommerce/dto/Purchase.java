package com.catalina.ecommerce.dto;

import com.catalina.ecommerce.entity.Address;
import com.catalina.ecommerce.entity.Customer;
import com.catalina.ecommerce.entity.Order;
import com.catalina.ecommerce.entity.OrderItem;
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
