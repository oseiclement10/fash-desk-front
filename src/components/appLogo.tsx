import logoImg from "@/assets/images/logo.png";

export const LogoWrapped = ({ containerStyling, imgStyling }: { containerStyling?: string, imgStyling?: string }) => {
    return (
        <div className={`w-18 border border-blue-500 h-16 bg-white rounded-xl flex items-center justify-center  shadow-lg ${containerStyling}`}>
                <LogoImg className={imgStyling} />
        </div>
    )
}


export const LogoImg = ({ className }: { className?: string }) => {
    return (
        <img src={logoImg} alt="bethel fashion erp logog" className={`h-10 w-10 object-contain ${className}`} />
    )
}



