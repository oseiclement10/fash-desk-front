import { Checkbox } from "antd";

type CustomCheckboxProps = {
    item: { id: number; name: string };
}

const CustomCheckbox = ({item}: CustomCheckboxProps) => {
    return (
        <Checkbox
            key={item.id}
            value={item.id}
            rootClassName="border  border-blue-300 hover:border-blue-400 hover:bg-blue-100 transition-smooth bg-blue-50 !px-2 !py-[3px] rounded-md"
        >
            <span className="capitalize"> {item.name?.replace("_", " ")} </span>
        </Checkbox>
    )
}

export default CustomCheckbox