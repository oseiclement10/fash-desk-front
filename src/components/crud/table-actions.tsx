import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineAutoDelete } from 'react-icons/md';



interface TableActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    onView?: () => void;
    extraActions?: React.ReactNode;
    titlePrefix?: string;
    allowEdit?: boolean;
    allowDelete?: boolean;
    allowView?: boolean;
    allowExtra?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({ onEdit, onDelete, onView, allowView, titlePrefix = 'item', allowExtra = true, allowDelete = true, allowEdit = true, extraActions }) => {
    return (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            {
                allowView && (
                    <button
                        onClick={onView}
                        title={`Edit ${titlePrefix}`}
                        className="border cursor-pointer rounded-md px-2 py-[2px] flex items-center text-xs hover:text-blue-600 active:opacity-10"
                    >
                        <AiOutlineEye className="mr-1" /> view
                    </button>
                )
            }


            {
                allowEdit && (
                    <button
                        onClick={onEdit}
                        title={`Edit ${titlePrefix}`}
                        className="border cursor-pointer rounded-md px-2 py-[2px] flex items-center text-xs hover:text-blue-600 active:opacity-10"
                    >
                        <FiEdit className="mr-1" /> Edit
                    </button>
                )
            }



            {
                allowDelete && (
                    <button
                        onClick={onDelete}
                        title={`Delete ${titlePrefix}`}
                        className="border cursor-pointer rounded-md px-2 py-[2px] flex items-center text-xs hover:text-rose-600 active:opacity-10"
                    >
                        <MdOutlineAutoDelete className="mr-1 text-rose-600" /> Delete
                    </button>
                )
            }

            {allowExtra ? extraActions : null}


        </div>
    );
};

export default TableActions;
