import { Box, Button, Dialog, DialogContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { AdminPasswordItemsType } from "@/types/admin";
import { signIn } from "next-auth/react";

interface Props {
    adminPasswordItems : AdminPasswordItemsType,
    setAdminPasswordItems : ( value : AdminPasswordItemsType ) => void;
}

const AdminPasswordDialog = ({ adminPasswordItems , setAdminPasswordItems } : Props) => {
    const [ showPassword , setShowPassword ] = useState<boolean>(false);

    return (
        <Dialog open={adminPasswordItems.open} onClose={() => {
            setAdminPasswordItems({open : false , password : ""});
            setShowPassword(false);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}}>
                <Typography variant="h5" sx={{ ml : "10px" , color : "white"}} >Admin</Typography>
                <TextField
                  onChange={(event) => setAdminPasswordItems({...adminPasswordItems , password : event.target.value }) }
                  autoFocus={true}
                  placeholder="Admin code"
                  type={showPassword ? "text" : "password"}
                  sx={{'& .MuiOutlinedInput-root': { borderRadius: '23px', bgcolor : "primary.main" , color : "white" , border : "1px solid white" , fontSize : "23px"  , height : "62px" , width : "283px" , px : "21px" } 
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
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"  }}>
                    <Button variant="contained" sx={{ textTransform : "none"}} onClick={() => {
                        setAdminPasswordItems({open : false , password : ""});
                        localStorage.clear();
                        setShowPassword(false);
                    }} >Cancel</Button>
                    <Button disabled={!adminPasswordItems.password} variant="contained" sx={{ textTransform : "none"}} onClick={() => {
                        localStorage.setItem("adminPassword" , adminPasswordItems.password );
                        signIn("google" , { callbackUrl : "/intro/backoffice/king-queen"})
                    }} >Gmail</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AdminPasswordDialog;