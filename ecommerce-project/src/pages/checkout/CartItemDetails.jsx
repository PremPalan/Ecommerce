import { useState } from "react";
import { formatMoney } from "../../utils/money";
import axios from "axios";

export function CartItemDetails({cartItem, loadCart}) {

    const [isUpdated, setIsUpdated] = useState(false);
    const [ quantity, setQuantity ] = useState(cartItem.quantity);

    const deleteCartItem = async () => {
        await axios.delete(`/api/cart-items/${cartItem.productId}`);
        await loadCart();
    }

   const updateQuantity = async () => {
    // Switch between true and false for isUpdatingQuantity.
    if (isUpdated) {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity),
      });
      await loadCart();
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
  };

  const updateQuantityInput = (event) => {
    setQuantity(event.target.value);
  };

  const handleQuantityKeyDown = (event) => {
    const keyPressed = event.key;

    if (keyPressed === 'Enter') {
      updateQuantity();

    } else if (keyPressed === 'Escape') {
      setQuantity(cartItem.quantity);
      setIsUpdated(false);
    }
  };

    return (
        <>
            <img className="product-image"
                src={cartItem.product.image} />

            <div className="cart-item-details">
                <div className="product-name">
                    {cartItem.product.name}
                </div>
                <div className="product-price">
                    {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                    <span>
                        Quantity: 
                            {
                                
                                isUpdated === true ? (
                                    <input 
                                        className="order-summary-input-quantity" 
                                        type="text" 
                                        value={quantity}
                                        onChange={updateQuantityInput}
                                        onKeyDown={handleQuantityKeyDown}
                                    />
                                ): (
                                    <span className="quantity-label">{cartItem.quantity}</span>
                                )
                            }    
                    </span>
                    <span className="update-quantity-link link-primary" onClick={updateQuantity}>
                        Update
                    </span>
                    <span className="delete-quantity-link link-primary"
                        onClick = {deleteCartItem}
                    >
                        Delete
                    </span>
                </div>
            </div>
        </>
    );
}