import type { ReactNode } from 'react'

type ListTileProps = {
    label: string;
    value: ReactNode;
}

const ListTile = ({ label, value }: ListTileProps) => {
    return (
        <div>
            <h3 className='text-[16px] text-slate-600'>{label}</h3>
            <div className="font-poppins capitalize">
                {value ?? "-"}
            </div>
        </div>
    )
}

type AddressTile = {
    label: string;
    value: ReactNode;
    icon?: ReactNode
}

export const AddressTile = ({ label, value, icon }: AddressTile) => {
    return (
        <div className="flex items-center ">
            <div className="w-[20px] text-lg text-slate-600">
                {icon}
            </div>
            <div className="ml-6">
                <h3 className=' text-slate-600 font-poppins text-[16px]'>{label}</h3>
                <div className="text-[15px] font-poppins">
                    {value}
                </div>
            </div>

        </div>
    )
}


export default ListTile