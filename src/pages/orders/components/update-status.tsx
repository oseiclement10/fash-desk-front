import { notification, DatePicker, Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import type { OverlayProps, UpdateProps } from "@/@types/common";
import type { OrderItem, OrderStatus } from "@/@types/orders";
import { status as orderStatusOptions } from "./filter-orders";
import {
    FormConfig,
    FormFooter,
    FormHeader,
} from "@/components/crud/form-config";
import { useMemo, useState } from "react";
import { api } from "..";
import { parseApiError } from "@/utils/parse-api-errors";
import { TrendingUp, CalendarClock } from "lucide-react";
import RadioGroup from "@/components/crud/radio-group";
import dayjs, { Dayjs } from "dayjs";

const UpdateStatus = ({
    closeModal,
    data: orderItem,
    cleanUp,
}: Omit<OverlayProps<OrderItem>, "mode"> & {
    cleanUp?: () => void;
}) => {
    
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
        orderItem?.status as OrderStatus
    );

    const [fittingDate, setFittingDate] = useState<Dayjs | null>(
        orderItem?.fitting_date ? dayjs(orderItem.fitting_date) : null
    );

    const [showDatePicker, setShowDatePicker] = useState(false);

  

    const isFitting = selectedStatus === "fitting";
    const hasFittingDate = !!orderItem?.fitting_date;

    const cantComplete =
        selectedStatus === "complete" &&
        Number(orderItem?.amount_paid) < Number(orderItem?.sub_total);

    const statusOptions = useMemo(
        () =>
            orderStatusOptions
                ?.filter((e) => e.key)
                ?.map(({ label, key }) => ({
                    label,
                    value: key,
                })),
        []
    );

    
    const { isPending, mutate } = useMutation({
        mutationFn: async (payload: UpdateProps) =>
            api.updateItem(payload),

        onSuccess: (data: OrderItem) => {
            notification.success({
                message: `Moved OrderItem #${orderItem?.id} to ${data.status}`,
            });
            cleanUp?.();
            closeModal();
        },

        onError: (error: any) => {
            notification.error({
                message: parseApiError(error),
            });
        },
    });

   
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({
            id: orderItem?.id as number,
            extraPath: `${orderItem?.id}/status`,
            data: {
                status: selectedStatus,
                ...(isFitting &&
                    fittingDate && {
                        date: fittingDate.format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                    }),
            },
        });
    };

    

    const renderFittingSection = () => {
        if (!isFitting) return null;

        return (
            <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarClock size={18} />
                    Fitting Schedule
                </div>

                {hasFittingDate && !showDatePicker ? (
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            Current date:
                            <span className="font-semibold ml-1">
                                {dayjs(orderItem?.fitting_date).format(
                                    "MMMM D, YYYY [at] h:mm A"
                                )}
                            </span>
                        </p>

                        <Button
                            size="small"
                            type="link"
                            onClick={() => setShowDatePicker(true)}
                        >
                            Change date
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <DatePicker
                            showTime
                            className="w-full"
                            value={fittingDate}
                            onChange={setFittingDate}
                            placeholder="Select fitting date & time"
                            disabledDate={(current) =>
                                current &&
                                current < dayjs().startOf("day")
                            }
                        />

                        {hasFittingDate && (
                            <Button
                                size="small"
                                type="link"
                                onClick={() =>
                                    setShowDatePicker(false)
                                }
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    

    return (
        <FormConfig>
            <form onSubmit={handleSubmit} className="py-1">
                <FormHeader>
                    Update order status <TrendingUp />
                </FormHeader>

                <div className="grid grid-cols-2 text-base">
                    <h3>Order Item ID : # {orderItem?.id}</h3>
                    <h3>
                        Current Status :
                        <span className="font-semibold ml-1">
                            {orderItem?.status}
                        </span>
                    </h3>
                </div>

                <div className="grid gap-6 my-4">
                    <RadioGroup
                        name="Change Status"
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={(val) =>
                            setSelectedStatus(val as OrderStatus)
                        }
                    />

                    {renderFittingSection()}

                    {cantComplete && (
                        <p className="text-sm text-red-500">
                            Cannot mark as{" "}
                            <strong>complete</strong> because this
                            order hasn't been fully paid for.
                            <br />
                            Pending Amount:{" "}
                            {Number(orderItem?.sub_total) -
                                Number(orderItem?.amount_paid)}
                        </p>
                    )}
                </div>

                <FormFooter
                    label="Update Status"
                    disabled={cantComplete || isPending}
                    loading={isPending}
                    onClose={closeModal}
                    loadMsg="Saving..."
                />
            </form>
        </FormConfig>
    );
};

export default UpdateStatus;
