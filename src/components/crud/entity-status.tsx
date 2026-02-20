import clsx from "clsx"

type StatusProps = {
    value: boolean;
    displayText?: "active" | "visible";
}

export function Status({ value, displayText = "active" }: StatusProps) {

    const styling = clsx("text-xs flex items-center w-fit px-2 py-[2px] rounded-sm", {
        "text-red-600 bg-red-100": !value,
        "text-white bg-emerald-600": value,
    })

    return (<span className={styling} > {value ? <span className="w-1 h-1 mr-1 flex rounded-full bg-white" /> : null} {value ? displayText == "active" ? "Active" : "Visible" : displayText == "visible" ? "Hidden" : "Inactive"} </span>)
}