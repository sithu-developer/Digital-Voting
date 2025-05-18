import { Box, Typography } from "@mui/material"

const ThankForVoting = () => {
    return (
        <Box sx={{ position : "relative" , p : "10px" , bgcolor : "#111136" , height : "100vh"}} >
            <Box sx={{ width : "fit-content" , position : "absolute" , left : "20px" , top : "60px"}}  >
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}} >THANKS</Typography>
                <Typography variant="h4" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}}>FOR</Typography>
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}}>VOTING</Typography>
                <Typography  sx={{ textAlign : "center" , fontFamily : "Javanese Text"}} >Results will be announced soon</Typography>
            </Box>

        </Box>
    )
}

export default ThankForVoting;