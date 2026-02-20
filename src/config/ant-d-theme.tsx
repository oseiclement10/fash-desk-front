import { type ThemeConfig } from 'antd';


export const antdTheme: ThemeConfig = {
    token: {
        // colorPrimary: "#1E3A8A",
        fontFamily: "Poppins",
    },
    components: {
        Select: {
            controlHeightLG: 45,
            fontFamily: "DM Sans",
            colorTextPlaceholder: "#64748b",
            colorBorder: "#94a3b8",
            activeOutlineColor: "white"
        },
        Button: {
            controlOutline: "white"
        },
        Table: {
            // headerBg: "#F5E6C8",
            cellPaddingBlock: 16,
        },
        Form: {
            labelColor: "#334155",
            labelFontSize: 14,
        },
        Slider: {
            handleColor: "#0489DB",
            trackBg: "#0489DBBF",
            dotActiveBorderColor: "#F4B100",
            handleSize: 10,
            handleLineWidth: 3,
            railSize: 5
        }

    }
}