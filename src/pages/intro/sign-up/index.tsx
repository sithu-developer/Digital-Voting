import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Image from "next/image";
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const SignUpPage = () => {
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    return (
        <Box sx={{ position : "relative" , width : "100vw" , height : "100vh" , bgcolor : "secondary.main" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center"  }} >
            <img src={"/BlurBackground.png"} style={{ height : "100vh" , opacity : "30%" }} />
            <Box sx={{ position : "absolute" , mb : "40px" , display : "flex" , flexDirection : "column" , gap : "13px" , justifyContent : "center" , alignItems : "center"  }} >
                <TextField
                placeholder="major code"
                type={showPassword ? "text" : "password"}
                sx={{'& .MuiOutlinedInput-root': { borderRadius: '23px', bgcolor : "primary.main" , color : "white" , border : "1px solid white" , fontSize : "23px" , fontFamily : "Jomolhari" , height : "62px" , width : "283px" , px : "21px" , boxShadow : '0px 6px 4px rgba(0, 0, 0, 0.2)' } 
                }}
                slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyRoundedIcon sx={{ color : "white" , fontSize : "31px"}} />
                        </InputAdornment>
                      ),
                      endAdornment : (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize : "20px"  }} /> : <VisibilityIcon sx={{ fontSize : "20px"}} />}
                      </IconButton>
                    </InputAdornment>
                      )
                    },
                }}
                />
                <Button variant="contained"  sx={{ border : "1px solid white" , borderRadius : "23px" , py : "10px" , px : "25px" , textTransform : "none" , boxShadow : '0px 6px 4px rgba(0, 0, 0, 0.2)' }} >
                    <Image alt="gmail icon" src={"/gmail.svg"} width={35} height={35} />
                    <Typography sx={{ ml : "10px" , fontFamily : "Jomolhari" , fontSize : "23px"}}>continue with gmail</Typography>
                </Button>
            </Box>
            <Button variant="contained"  sx={{ position : "absolute" , bottom : "25px" , right : "25px" , border : "1px solid white" , borderRadius : "15px" , py : "8px" , px : "15px" , textTransform : "none" , boxShadow : '0px 6px 4px rgba(0, 0, 0, 0.2)' }} >
                <EngineeringRoundedIcon sx={{color : "white" , fontSize : "25px"}} />
                <Typography sx={{ ml : "10px" , fontFamily : "Jomolhari" , fontSize : "20px"}}>For admin</Typography>
            </Button>
        </Box>
    )
}

export default SignUpPage;