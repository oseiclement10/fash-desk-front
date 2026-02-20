import { Form, Input, InputNumber, DatePicker, type UploadFile, Button } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";
import { useOrderCreation } from "@/contexts/order-creation/order-creation";
import UploadImage, { setupImageForDisplay } from "@/components/crud/image-upload";
import useCreateOrder from "../useCreateOrder";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import ListTile from "@/components/crud/list-tile";
import Measurement from "@/pages/customers/details/Measurement";
import type { Customer } from "@/@types/customer";


const SingleOrderForm = () => {

    const [form] = Form.useForm();
    const [styleImage, setStyleImage] = useState<UploadFile[]>([]);
    const [fabricImage, setFabricImage] = useState<UploadFile[]>([]);

    const [showError, setShowError] = useState(false);

    const { state, dispatch } = useOrderCreation();
    const { single, info } = state;


    const {
        createOrder,
        saving,
        error
    } = useCreateOrder();

    const onFinish = (values: any) => {
        const payload = {
            ...values,
            type: "single",
            quantity: info?.quantity,
            due_date: values.due_date?.format("YYYY-MM-DD"),
            fitting_date: values.fitting_date?.format("YYYY-MM-DD"),
            customer_id: info?.customer?.id,
            style_img: styleImage[0]?.originFileObj,
            fabric_img: fabricImage[0]?.originFileObj,
        };


        dispatch({
            type: "SET_SINGLE",
            payload
        });

        createOrder(payload);
    };

    const onBack = () => {
        dispatch({ type: "SET_FORM_MODE", payload: { mode: "initiate" } });
    }

    useEffect(() => {
        if (single) {
            form.setFieldsValue({
                description: single.description,
                quantity: single.quantity,
                price: single.price,
                due_date: dayjs(single.due_date),
                fitting_date: dayjs(single.fitting_date),
            });

            if (single.style_img) {
                setStyleImage(
                    setupImageForDisplay(single.style_img, single.customer_id + "_customer")
                );
            }

            if (single.fabric_img) {
                setFabricImage(setupImageForDisplay(single.fabric_img, single.customer_id + "_customer"));
            }
        } else {
            form.resetFields();
            setStyleImage([]);
            setFabricImage([]);
        }
    }, [single]);

    return (
        <>
            <div className="space-y-5 mb-5">
                <ListTile
                    label="Customer Name"
                    value={<h2 className="text-lg">  {info?.customer?.full_name}</h2>}

                />

                <ListTile
                    label="Measurement"
                    value={<div className="mt-2">
                        <Measurement
                            isOrderPreview
                            customer={info?.customer as Customer}
                            onEditSucccess={(val) => dispatch({ type: "UPDATE_ORDER_CUSTOMER", payload: val })}
                        />
                    </div>
                    }
                />
            </div>




            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={() => setShowError(false)}
                initialValues={{
                    quantity: 1,
                }}
            >

                <Form.Item label="Style Image" >
                    <UploadImage value={styleImage} updateValue={(val) => setStyleImage(val)} />
                </Form.Item>

                <Form.Item label="Fabric Image" >
                    <UploadImage value={fabricImage} updateValue={(val) => setFabricImage(val)} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter a description" }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="E.g., White African print shirt with embroidery"
                    />
                </Form.Item>






                <Form.Item
                    name="price"
                    label={(info?.quantity || 1) > 1 ? "Price Per Each" : "Price"}
                    rules={[{ required: true, message: "Enter price" }]}
                >
                    <InputNumber
                        min={0}
                        className="!w-full"
                        size="large"
                        placeholder="Enter price"
                    />
                </Form.Item>


                <Form.Item
                    name="cost"
                    label={(info?.quantity || 1) > 1 ? `Total Cost for the (${info?.quantity}) Items ` : "Cost"}
                    rules={[{ required: true, message: "Enter cost" }]}
                >
                    <InputNumber
                        min={0}
                        className="!w-full"
                        size="large"
                        placeholder="Enter cost"
                    />
                </Form.Item>


                <Form.Item
                    name="amount_paid"
                    label="Initial Payment"
                    dependencies={["price", "quantity"]}
                    rules={[
                        { required: true, message: "Enter amount paid" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const price = getFieldValue("price");
                                const quantity = info?.quantity || 1;

                                if (value == null || price == null) return Promise.resolve();

                                const total = price * quantity;

                                if (value > total) {
                                    return Promise.reject(
                                        new Error(`Initial payment cannot exceed total price (${total})`)
                                    );
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <InputNumber
                        min={0}
                        className="!w-full"
                        size="large"
                        placeholder="Enter amount paid"
                    />
                </Form.Item>

                <Form.Item
                    name="fitting_date"
                    label="Fitting Date"
                >
                    <DatePicker
                        size="large"
                        className="!w-full"
                        format="YYYY-MM-DD"
                        disabledDate={(d) => d && d < dayjs().startOf("day")}
                    />
                </Form.Item>

                <Form.Item
                    name="due_date"
                    label="Expected Delivery Date"
                    rules={[{ required: true, message: "Please select due date" }]}
                >
                    <DatePicker
                        size="large"
                        className="!w-full"
                        format="YYYY-MM-DD"
                        disabledDate={(d) => d && d < dayjs().startOf("day")}
                    />
                </Form.Item>

                {showError && error && (
                    <FormErrorAlert
                        className="md:col-span-2"
                        message={parseApiError(error as RequestError)}
                    />
                )}

                <div className="md:col-span-2 border-t space-x-8 pt-5 mt-4 flex items-center justify-between">
                    <Button
                        type="default"
                        htmlType="button"
                        size="large"
                        icon={<IoMdArrowBack />}
                        className="!w-2/6"
                        onClick={onBack}

                        loading={false}
                    >
                        Back
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={!saving && <IoMdArrowForward />}
                        loading={saving}
                        disabled={saving}
                        className="
        !bg-primary-foreground/95
        hover:!bg-primary-foreground
        !text-white
        disabled:!text-white
        lg:!w-4/6
        shadow-md
        hover:shadow-lg
        transition-all
        duration-200
        flex
        items-center
        justify-center
        gap-2
    "
                    >
                        <span
                            className={`transition-opacity duration-200 ${saving ? "opacity-90" : "opacity-100"
                                }`}
                        >
                            {saving ? "Creating order…" : "Create order"}
                        </span>
                    </Button>

                </div>
            </Form>
        </>

    );
};

export default SingleOrderForm;
