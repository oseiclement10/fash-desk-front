import { Select } from "antd"

const defaultOptions = [

    {
        label: "Active",
        value: "1"
    },
    {
        label: "Inactive",
        value: "0"
    }
]

type StatusFilterProps = {
    onFilter: (val: string) => void;
    val?: string;
    placeholder?: string;
    loading?: boolean;
    options?: {
        label: string;
        value: string;
    }[];
}

const StatusFilter = ({
    onFilter,
    val,
    placeholder = "filter",
    loading,
    options = defaultOptions
}: StatusFilterProps) => {

    return (
        <Select
            options={options}
            showSearch
            optionFilterProp="label"
            loading={loading}
            allowClear
            onClear={() => onFilter("")}
            onSelect={onFilter}
            value={val || null}
            placeholder={placeholder}
            className="min-w-[100px]"
            defaultValue={options[0]?.value}
        />
    )
}

export default StatusFilter