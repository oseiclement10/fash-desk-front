import { FormConfig, FormHeader } from "@/components/crud/form-config"
import { CopyPlus } from "lucide-react"
import { GoBackBtn } from "@/components/buttons/backbutton"
import { appRoutes } from "@/routes"
import { useOrderCreation } from "@/contexts/order-creation/order-creation"
import InitiationForm from "./components/initiate";
import SingleOrderForm from "./components/single-order"
import MultiOrderForm from "./components/multi-order"
import VariableOrderForm from "./components/variable-order"



const OrderCreationFlow = () => {

    const {
        state
    } = useOrderCreation();

    return (
        <section className="bg-white md:p-6 p-3 border border-gray-200 rounded-xl overflow-hidden">
            <div id="scroll-anchor" />
            <FormConfig>
                <FormHeader>
                    New Order <CopyPlus className="ml-2" size={20} />

                    <GoBackBtn label="View Orders" backLink={appRoutes.orders.path} />
                </FormHeader>

                {state.mode == "initiate" ?
                    <InitiationForm /> :
                    state.mode == "order-creation" ?
                        <FormFlow /> :
                        null
                }


            </FormConfig>
        </section>
    )
}

const FormFlow = () => {
    const { state } = useOrderCreation();

    switch (state.type) {
        case "single":
            return <SingleOrderForm />;
        case "multiple":
            return <MultiOrderForm />;
        case "variable":
            return <VariableOrderForm />
        default:
            return <p>Something went wrong</p>
    }
}

export default OrderCreationFlow