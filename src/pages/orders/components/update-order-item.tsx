import { useEffect, useState } from "react";
import { DatePicker, Form, Input, type UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { OverlayProps } from "@/@types/common";
import type { OrderItem } from "@/@types/orders";
import UploadImage, { setupImageForDisplay } from "@/components/crud/image-upload";
import { FormConfig, FormFooter, FormHeader } from "@/components/crud/form-config";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";


const UpdateOrderItem = ({ data: orderItem, closeModal, api, cleanUp }: Omit<OverlayProps<OrderItem>, "mode"> & { cleanUp?: () => void }) => {


    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    const [styleImg, setStyleImg] = useState<UploadFile[]>([]);
    const [fabricImg, setFabricImg] = useState<UploadFile[]>([]);

    const { update, saving } = useDataMutationHook({
        api,
        title: "Order Item",
        onSuccessFn: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.orders] });
            closeModal();
            cleanUp && cleanUp();
        },
        hasFile: true,
        successMsg: "Order Item Updated Successfully",
    });

    const onFinish = (values: any) => {
        const record = {
            ...values,
            due_date: values?.due_date.format("YYYY-MM-DD"),
            fitting_date: values?.fitting_date.format("YYYY-MM-DD"),
            style_img: styleImg[0]?.originFileObj,
            fabric_img: fabricImg[0]?.originFileObj
        };

        update({
            id: orderItem?.id as number,
            data: record
        });

    }


    useEffect(() => {
        if (orderItem) {
            form.setFieldsValue({
                cost: orderItem.cost,
                price: orderItem.price,
                due_date: dayjs(orderItem.due_date),
                description: orderItem.description,
                style_img: orderItem.style_img,
                fitting_date: dayjs(orderItem.fitting_date),
            });

            if (orderItem?.fabric_img) {
                setFabricImg(setupImageForDisplay(orderItem?.fabric_img, orderItem?.customer?.full_name || ""))
            } else {
                setFabricImg([])
            }

            if (orderItem?.style_img) {
                setStyleImg(setupImageForDisplay(orderItem?.style_img, orderItem?.customer?.full_name || ""))
            } else {
                setStyleImg([])
            }
        }
    }, [orderItem]);

    return (
        <FormConfig>
            <Form
                form={form}
                layout="vertical"
                className="mt-6"
                onFinish={onFinish}
            >
                <FormHeader>Update Order Item # {orderItem?.id}</FormHeader>

                <div className="space-y-6">
                    {/* Style Image */}
                    <Form.Item label="Style Image">
                        <UploadImage
                            value={styleImg}
                            updateValue={(val) => setStyleImg(val)}
                        />
                    </Form.Item>

                    <Form.Item label="Fabric Image" >
                        <UploadImage value={fabricImg} updateValue={(val) => setFabricImg(val)} />
                    </Form.Item>


                    {/* Cost */}
                    <Form.Item
                        label="Cost"
                        name="cost"
                        rules={[{ required: true, message: "Please enter cost" }]}
                    >
                        <Input
                            type="number"
                            placeholder="Enter cost"
                            className="w-full "
                            size="large"
                        />
                    </Form.Item>

                    {/* Price */}
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: "Please enter price" }]}
                    >
                        <Input
                            type="number"
                            placeholder="Enter price"
                            className="w-full "
                            size="large"
                        />
                    </Form.Item>

                    {/* Due Date */}

                    <Form.Item
                        label="Fitting Date"
                        name="fitting_date"
                    >
                        <DatePicker
                            size="large"
                            className="w-full "
                        />
                    </Form.Item>


                    <Form.Item
                        label="Expected Completion Date"
                        name="due_date"
                        rules={[{ required: true, message: "Please select a date" }]}
                    >
                        <DatePicker
                            size="large"
                            className="w-full "
                        />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label="Order Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter a description" }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter order description here"
                        />
                    </Form.Item>
                </div>

                <div className="mt-8 mb-6">
                    <FormFooter
                        label="Update Order"
                        loading={saving}
                        disabled={saving}
                        onClose={closeModal}
                        loadMsg="Updating order..."
                    />
                </div>
            </Form>

        </FormConfig>
    );
};

export default UpdateOrderItem;
