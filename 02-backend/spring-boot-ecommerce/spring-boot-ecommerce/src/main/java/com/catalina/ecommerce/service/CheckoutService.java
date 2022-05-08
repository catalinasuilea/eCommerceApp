package com.catalina.ecommerce.service;

import com.catalina.ecommerce.dto.Purchase;
import com.catalina.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
