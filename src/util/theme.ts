import { createTheme } from "@mui/material";

export const theme  = createTheme({
    palette : {
        primary : {
            main : "#326BBA" // button color
        },
        secondary : {
            main : "#6790CC" // background color
        },
        info : {
            main : "#091370" // backoffice topbar bg color
        }
    },
    typography : { // cursive
        fontFamily : "monospace",
        allVariants : {
            color : "white"
        }
    },
    
})