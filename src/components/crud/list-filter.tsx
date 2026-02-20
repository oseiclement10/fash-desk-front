import { Select } from 'antd'
import { useGetActive } from '@/hooks/use-get-active';
import type { GetActiveProps } from '@/hooks/use-get-active';

type ListFilterProps<T> = {
    onSelect: (val: string) => void,
    defaultVal?: string;
    className?: string;
} & GetActiveProps<T>;


const ListFilter = <T extends { name: string, id: number }>({ onSelect, api, queryKey, title, defaultVal, className, customPath }: ListFilterProps<T>) => {


    const { data, isLoading } = useGetActive<T>({
        api,
        queryKey,
        title,
        customPath
    })



    return (
        <Select
            className={`!min-w-[180px] ${className}`}
            allowClear
            onClear={() => {
                onSelect("");
            }}
            optionFilterProp='label'
            showSearch
            loading={isLoading}
            placeholder={`Filter by a ${title}`}
            value={defaultVal ? parseInt(defaultVal) : null}
            onSelect={(val) => onSelect(val?.toString())}
            options={data?.data?.map(elem => ({ label: elem.name, value: elem.id, key: elem.id }))}
        />
    )
}

export default ListFilter