import { Form, Input, InputNumber, DatePicker, Progress, type UploadFile, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";
import { useOrderCreation } from "@/contexts/order-creation/order-creation";
import useCreateOrder from "../useCreateOrder";
import ListTile from "@/components/crud/list-tile";
import Measurement from "@/pages/customers/details/Measurement";
import type { Customer } from "@/@types/customer";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import UploadImage, { setupImageForDisplay } from "@/components/crud/image-upload";


const MultiOrderForm = () => {

    const anchorRef = useRef<HTMLSpanElement>(null);

    const [form] = Form.useForm();
    const [showError, setShowError] = useState(false);
    const [styleImage, setStyleImage] = useState<UploadFile[]>([]);
    const [fabricImage, setFabricImage] = useState<UploadFile[]>([]);


    const { state, dispatch } = useOrderCreation();
    const { multi, info } = state;
    const { step } = multi;

    // Determine current progress
    const totalSteps = info?.quantity || 1;
    const currentStep = step + 1;
    const progress = Math.abs(Math.round((currentStep / totalSteps) * 100) - 10);



    const onBack = () => {
        if (step > 0) {
            dispatch({
                type: "SET_MULTI_STEP",
                payload: step - 1,
            });

        } else {
            dispatch({ type: "SET_FORM_MODE", payload: { mode: "initiate" } });

        }
    }

    const scrollToAnchor = () => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };



    const {
        createOrder,
        saving,
        error
    } = useCreateOrder();

    const onFinish = (values: any) => {
        const payload = {
            ...values,
            quantity: 1,
            due_date: values.due_date?.format("YYYY-MM-DD"),
            style_img: styleImage[0]?.originFileObj,
            fabric_img: fabricImage[0]?.originFileObj,
            fitting_date: dayjs(values.fitting_date)?.format("YYYY-MM-DD"),
        };

        if (step + 1 < totalSteps) {
            dispatch({
                type: "ADD_MULTI_ITEM",
                payload: payload,
            })
            dispatch({
                type: "SET_MULTI_STEP",
                payload: step + 1,
            });

            scrollToAnchor();

        } else {

            const reqBody = {
                customer_id: info?.customer.id,
                type: "multiple",
                order_items: [...state.multi.order_items, payload]
            }
            createOrder(reqBody);

        }


    };



    useEffect(() => {
        const item = state.multi.order_items[step];

        if (!item) {
            form.resetFields();
            setStyleImage([]);
            setFabricImage([]);
            return;
        }

        form.setFieldsValue({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            amount_paid: item.amount_paid,
            cost: item.cost,
            due_date: dayjs(item.due_date),
            fitting_date: dayjs(item.fitting_date)
        });

        if (item.style_img) {
            setStyleImage(setupImageForDisplay(item.style_img, info?.customer?.id + "_customer"));
        }

        if (item.fabric_img) {
            setFabricImage(setupImageForDisplay(item.fabric_img, info?.customer?.id + "_customer"));
        }


    }, [step, multi]);



    return (
        <div>
            <span id="anchor" ref={anchorRef} />
            {/* Progress Bar */}
            <div className="mb-4">

                <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-600">
                        Step {currentStep} of {totalSteps}
                    </span>
                    <span className="text-gray-500 text-sm">{progress}%</span>
                </div>
                <Progress percent={progress} showInfo={false} />
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={() => setShowError(false)}

            >
                <section className="mb-5">
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

                </section>

                <Form.Item label="Fabric Image" >
                    <UploadImage value={fabricImage} updateValue={(val) => setFabricImage(val)} />
                </Form.Item>


                <Form.Item label="Style Image" >
                    <UploadImage value={styleImage} updateValue={(val) => setStyleImage(val)} />
                </Form.Item>

                {/* Description */}
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



                {/* Price */}
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Enter price" }]}
                >
                    <InputNumber min={0} className="w-full!" size="large" />
                </Form.Item>

                {/* Cost */}
                <Form.Item
                    name="cost"
                    label="Cost"
                    rules={[{ required: true, message: "Enter cost" }]}
                >
                    <InputNumber min={0} className="w-full!" size="large" />
                </Form.Item>

                <Form.Item
                    name="amount_paid"
                    label="Initial Payment"
                    dependencies={["price"]}
                    rules={[
                        { required: true, message: "Enter amount paid" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const price = getFieldValue("price");
                                if (value == null) return Promise.resolve();
                                if (price == null) return Promise.resolve();

                                if (value > price) {
                                    return Promise.reject(
                                        new Error("Initial payment cannot be greater than the price")
                                    );
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <InputNumber min={0} className="w-full!" size="large" />
                </Form.Item>

                <Form.Item
                    name="fitting_date"
                    label="Fitting Date"
                >
                    <DatePicker
                        size="large"
                        className="w-full!"
                        format="YYYY-MM-DD" 
                        disabledDate={(d) => d && d < dayjs().startOf("day")}
                    />
                </Form.Item>

                <Form.Item
                    name="due_date"
                    label="Due Date"
                    rules={[{ required: true, message: "Please select due date" }]}
                >
                    <DatePicker
                        size="large"
                        className="w-full!"
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
                        disabled={saving}
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
                            {saving ? "Creating Order" : currentStep == totalSteps ? "Create Order" : "Continue "}

                        </span>
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default MultiOrderForm;
