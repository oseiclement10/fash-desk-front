import { DatePicker, Button, Space, Tag } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const { RangePicker } = DatePicker;

export interface DateRangeFilterProps {
    value?: [Dayjs | null, Dayjs | null] | null;
    onChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
    onClear?: () => void;
    isFilterApplied?: boolean;
    recordCount?: number;
    className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    value,
    onChange,
    onClear,
    isFilterApplied = false,
    recordCount,
    className = ""
}) => {
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current > dayjs().endOf('day');
    };

    const handleDateChange = (dates: null | (Dayjs | null)[]) => {
        if (dates && dates[0] && dates[1]) {
            onChange?.([dates[0], dates[1]]);
        } else {
            onChange?.(null);
        }
    };

    const handleClear = () => {
        onChange?.(null);
        onClear?.();
    };

    

    const presets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
            {
                label: 'Today',
                value: [dayjs(), dayjs()],
            },
            {
                label: 'Yesterday',
                value: [dayjs().add(-1, 'day'), dayjs().add(-1, 'day')],
            },
            {
                label: 'Last 7 Days',
                value: [dayjs().add(-7, 'day'), dayjs()],
            },
            {
                label: 'Last 30 Days',
                value: [dayjs().add(-30, 'day'), dayjs()],
            },
            {
                label: 'This Month',
                value: [dayjs().startOf('month'), dayjs().endOf('month')],
            },
            {
                label: 'Last Month',
                value: [
                    dayjs().add(-1, 'month').startOf('month'),
                    dayjs().add(-1, 'month').endOf('month'),
                ],
            },
        ];




    return (
        <div className={className}>
            <Space className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2">
                    <RangePicker
                        value={value}
                        onChange={handleDateChange}
                        disabledDate={disabledDate}
                        format="MMM DD, YYYY"
                        placeholder={['Start Date', 'End Date']}
                        // className="w-full md:w-64"
                        allowClear={true}
                        presets={presets}
                        placement="bottomRight"
                    />

                    {isFilterApplied && (
                        <Button
                            type="text"
                            onClick={handleClear}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </Space>

            {/* Date Range Display */}
            {value && value[0] && value[1] && (
                <div className="mt-3 flex md:flex-row flex-col md:items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Showing transactions from:</span>
                    <Tag color="blue" className="w-fit">
                        {value[0].format('MMM DD, YYYY')} - {value[1].format('MMM DD, YYYY')}
                    </Tag>
                    {recordCount !== undefined && (
                        <span className="text-gray-500">
                            ({recordCount} records found)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;