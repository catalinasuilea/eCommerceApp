package com.catalina.ecommerce.service;

import com.catalina.ecommerce.dto.PaymentInfo;
import com.catalina.ecommerce.dto.Purchase;
import com.catalina.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
