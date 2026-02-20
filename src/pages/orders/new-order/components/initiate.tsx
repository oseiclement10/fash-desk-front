import PrimaryButton from "@/components/buttons/primary";
import CustomerSearchSelect from "@/components/crud/customer-search-select";
import RadioGroup from "@/components/crud/radio-group";
import { queryKeys } from "@/constants/query-keys";
import { Form, InputNumber, Modal } from "antd"
import { IoMdArrowForward } from "react-icons/io";
import { api } from "../../../customers"
import { useModalProps } from "@/hooks/use-modal";
import { Plus } from "lucide-react";
import type { OrderInfo } from "@/contexts/order-creation/types";
import { useOrderCreation } from "@/contexts/order-creation/order-creation";
import { useEffect } from "react";
import CustomerRegistrationProcess from "@/pages/customers/registration/main";



const NewOrder = () => {

    const {
        state,
        dispatch
    } = useOrderCreation();

    const [form] = Form.useForm();

    const quantity = Form.useWatch("quantity", form);

    const onFinish = (values: OrderInfo) => {
        dispatch({ type: "INITIATE", payload: values });
    }

    useEffect(() => {
        if (state.info) form.setFieldsValue(state.info);
    }, [state.info]);


    const { modalOpen, closeModal, updateModal } = useModalProps();

    return (
        <>
            <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ quantity: 1 }}>
                <Form.Item
                    label="Customer"
                    required
                >
                    <div className="flex items-center space-x-4">
                        <Form.Item
                            name="customer"
                            noStyle
                            rules={[{ required: true, message: "Please select a customer" }]}
                        >
                            <CustomerSearchSelect
                                placeholder="Search customer"
                                queryKey={queryKeys.customers}
                                fetchFn={(val) => api.getPaginatedData({ search: val })}
                            />
                        </Form.Item>

                        <button onClick={() => updateModal(null, "add")}
                            className="flex items-center md:px-6 px-4 py-1.5 md:py-2.5 min-w-fit active:opacity-30 text-primary rounded-md  hover:border-secondary hover:text-secondary border-2 border-primary/90  transition-colors ease-in-out duration-200">
                            <Plus />
                            <span className="md:hidden">New</span>
                            <span className="hidden md:inline">New Customer</span>

                        </button>


                    </div>
                </Form.Item>

                <Form.Item rules={[{ required: true }]} name="quantity" label="Quantity">
                    <InputNumber size="large" className="!w-full" min={1} />
                </Form.Item>

                {Number(quantity || 0) > 1 ? (
                    <>

                        <Form.Item label="Measurement Mode" name="measurement_mode" rules={[{ required: true, message: "Please select a measurement mode" }]} >
                            <RadioGroup
                                name="Measurement Mode"
                                options={measurementOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Styling Mode" name="style_mode" rules={[{ required: true, message: "Please select a styling mode" }]}>
                            <RadioGroup
                                name="Styling Mode"
                                options={stylingOptions}

                            />
                        </Form.Item>



                    </>
                ) : null}

                <div className="flex justify-end">
                    <PrimaryButton label="Continue" icon={<IoMdArrowForward />} />
                </div>
            </Form>

            <Modal
                footer={null}
                open={modalOpen.open}
                width={850}
                onCancel={closeModal}
            >

                {modalOpen.type === "add" && (
                    <CustomerRegistrationProcess
                        inModalMode
                        
                    />
                )}
            </Modal>

        </>


    )
}



const measurementOptions =
    [
        {
            label: "Same Measurement",
            value: "single",
        },
        {
            label: "Different Measurments",
            value: "multi",
        },
    ]

const stylingOptions =
    [
        {
            label: "Same Style",
            value: "single",
        },
        {
            label: "Different Styles",
            value: "multi",
        },
    ]

export default NewOrder