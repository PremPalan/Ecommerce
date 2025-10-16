import axios from 'axios';
import { useState, useEffect } from 'react';
import { CheckoutHeader } from './CheckoutHeader';
import { OrderSummary } from './OrderSummary';

import './CheckoutPage.css';
import { PaymentSummary } from './PaymentSummary';

export function CheckoutPage({ cart }) {

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState([]);

  useEffect(() => {
    axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
      .then((response) => {
        setDeliveryOptions(response.data);
      });

    axios.get('/api/payment-summary')
      .then((response) => {
        setPaymentSummary(response.data);
      });
  }, []);

  return (
    <>
      <title>Checkout</title>
      <link rel="icon" type="image/svg+xml" href="cart-favicon.png" />

      <CheckoutHeader />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions}/>
          <PaymentSummary paymentSummary={paymentSummary}/>
        </div>
      </div>
    </>
  );
}