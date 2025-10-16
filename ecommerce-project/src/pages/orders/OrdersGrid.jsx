import { OrderDetailsGrid } from "./OrderDetailsGrid";
import { OrdersGridHeader } from "./OrdersGridHeader";
export function OrdersGrid({orders}) {
    return (
        <div className="orders-grid">
            {orders.map((order) => {
                return (
                    <div key={order.id} className="order-container">
                        <OrdersGridHeader order={order} />
                        <OrderDetailsGrid order={order} />
                    </div>
                );
            })}
        </div>
    );
}