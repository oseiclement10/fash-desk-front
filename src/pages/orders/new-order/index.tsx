import { OrderCreationProvider } from "@/contexts/order-creation/order-creation"
import OrderCreationFlow from "./main"
import { CustomerCreationProvider } from "@/contexts/customer-registration/customer-registration";

const NewOrderWrapper = () => {
    return (
        <CustomerCreationProvider>
            <OrderCreationProvider>
                <OrderCreationFlow />
            </OrderCreationProvider>
        </CustomerCreationProvider>

    )
}

export default NewOrderWrapper