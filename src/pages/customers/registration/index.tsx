
import { CustomerCreationProvider } from "@/contexts/customer-registration/customer-registration";
import CustomerRegistrationProcess from "./main";



const CustomerRegistration = () => {
    return (
        <CustomerCreationProvider>
            <CustomerRegistrationProcess  />
        </CustomerCreationProvider>
    )
}





export default CustomerRegistration