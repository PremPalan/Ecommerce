import { useState } from "react";
import axios from "axios";
import { formatMoney } from "../../utils/money";
import { useNavigate } from "react-router";

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async () => {
    setError(null);
    setLoading(true);

    try {
      // create order
      await axios.post('/api/orders');

      // call loadCart only if it's a function (guard against missing prop)
      if (typeof loadCart === 'function') {
        try {
          await loadCart();
        } catch (loadErr) {
          console.warn('loadCart threw an error:', loadErr);
          // we continue to navigate even if loadCart fails, but you can change this
        }
      } else {
        // Helpful warning for debugging if parent didn't pass the function
        console.warn('PaymentSummary: loadCart prop is not a function (skipping). Received:', loadCart);
      }

      // navigate to orders page
      navigate('/orders');
    } catch (err) {
      console.error('Failed to create order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>

      {paymentSummary && (
        <>
          <div className="payment-summary-row">
            <div>Items ({paymentSummary.totalItems}):</div>
            <div className="payment-summary-money">{formatMoney(paymentSummary.productCostCents)}</div>
          </div>

          <div className="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div className="payment-summary-money">{formatMoney(paymentSummary.shippingCostCents)}</div>
          </div>

          <div className="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostBeforeTaxCents)}</div>
          </div>

          <div className="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div className="payment-summary-money">{formatMoney(paymentSummary.taxCents)}</div>
          </div>

          <div className="payment-summary-row total-row">
            <div>Order total:</div>
            <div className="payment-summary-money">{formatMoney(paymentSummary.totalCostCents)}</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="place-order-button button-primary"
            onClick={createOrder}
            disabled={loading}
          >
            {loading ? 'Placing order...' : 'Place your order'}
          </button>
        </>
      )}
    </div>
  );
}
