import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type Props = {
    backLink?: string;
    label?: string;
    className?: string;
}

export const GoBackBtn = ({ backLink, label, className }: Props) => {

    const navigate = useNavigate();

    const goBack = () => {
        if (backLink) {
            navigate(backLink);
        }
        else {
            navigate(-1);
        }
    }


    return (
        <button onClick={() => goBack()} className={`border px-3 ml-auto  text-sm py-1 rounded-md flex items-center  bg-white hover:border-blue-300 hover:text-blue-600 transition-all ease-in-out ${className ?? ""}`}>
            <IoMdArrowBack className='mr-1' />  {label ?? "Go Back"}
        </button>
    )
}

