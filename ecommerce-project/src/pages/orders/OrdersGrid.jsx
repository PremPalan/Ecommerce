import { OrderDetailsGrid } from "./OrderDetailsGrid";
import { OrdersGridHeader } from "./OrdersGridHeader";
export function OrdersGrid({orders, loadCart}) {
    return (
        <div className="orders-grid">
            {orders.map((order) => {
                return (
                    <div key={order.id} className="order-container">
                        <OrdersGridHeader order={order} />
                        <OrderDetailsGrid order={order} loadCart={loadCart} />
                    </div>
                );
            })}
        </div>
    );
}