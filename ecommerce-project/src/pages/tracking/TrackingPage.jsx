import { Link } from 'react-router';
import { Header } from '../../components/Header';
import { useParams } from 'react-router';
import axios from 'axios';
import './TrackingPage.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export function TrackingPage({ cart }) {
  const { orderID, productID } = useParams();
  const [ order, setOrder ] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
        const response=await axios.get(`api/orders/${orderID}?expand=products`);
        setOrder(response.data);
    }

    fetchTrackingData();
  }, [orderID]);

  if(!order) { return null; }

  const orderProduct = order.products.find((orderProduct) => {
    return orderProduct.productId === productID;
  });

  const estimatedMs = Number(orderProduct.estimatedDeliveryTimeMs);
  const orderTimeMs = Number(order.orderTimeMs);

  if (Number.isNaN(estimatedMs) || Number.isNaN(orderTimeMs)) {
    console.warn('Invalid timestamps on order or product', { estimatedMs, orderTimeMs });
  }

  let totalDeliveryTimeMs = estimatedMs - orderTimeMs;

  if (!isFinite(totalDeliveryTimeMs) || totalDeliveryTimeMs <= 0) {
    totalDeliveryTimeMs = 1; // avoid division by zero; will clamp to 100% below
  }

  let timePassedMs = dayjs().valueOf() - orderTimeMs;
  let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (!isFinite(deliveryPercent)) deliveryPercent = 0;
  deliveryPercent = Math.max(0, Math.min(100, deliveryPercent));

  console.log('tracking progress %', deliveryPercent.toFixed(1));

  let isPreparing,isShipped,isDelivered;

  if(deliveryPercent < 33){
    isPreparing = deliveryPercent;
  }else if(deliveryPercent >=33 && deliveryPercent < 100){
    isShipped = deliveryPercent;
  }else if(deliveryPercent === 100){
    isDelivered = deliveryPercent;
  }

  return (
    <>
      <title>Tracking</title>
      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header cart={cart}/>

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            Arriving on {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
          </div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div className= {`progress-label ${isPreparing && 'current-status'}`} >
              Preparing
            </div>
            <div className= {`progress-label ${isShipped && 'current-status'}`} >
              Shipped
            </div>
            <div className= {`progress-label ${isDelivered && 'current-status'}`} >
              {deliveryPercent >= 100 ? 'Delivered on' : 'Arriving on'}
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar"
              style={
                {width: `${deliveryPercent}%`}
              }
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}