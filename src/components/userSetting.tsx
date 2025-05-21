import { useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material"
import { signOut } from "next-auth/react";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditUser from "./EditUser";
import { useState } from "react";
import Agenda from "./Agenda";



interface Props {
    userSettingOpen : boolean;
    setUserSettingOpen : (value : boolean) => void;
}

const UserSetting = ( { setUserSettingOpen , userSettingOpen } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const [ userEditUserOpen , setUserEditUserOpen ] = useState<boolean>(false);
    const [ agendaOpen , setAgendaOpen ] = useState<boolean>(false);
    

    if(!user) return null;
    return (
        <Dialog open={userSettingOpen} onClose={() => setUserSettingOpen(false)} 
            slotProps={{
                paper : {
                    sx : { borderRadius : "15px"}
                }
            }}
        >
            <DialogTitle sx={{ bgcolor : "#1B1D84"}}>
                <Box sx={{  width : "105%" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                    <Typography variant="h5" >Setting</Typography>
                    <IconButton onClick={() => setUserSettingOpen(false)} >
                        <ClearRoundedIcon sx={{ color : "lightgray" , fontSize : "30px"}} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ bgcolor : "info.main" , display : "flex" , flexDirection : "column" , gap : "15px"  , overflowX : "hidden"}} >
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "5px" , mt : "10px"}}>
                    <Typography >Name : {user.name}</Typography>
                    <IconButton onClick={() => setUserEditUserOpen(true)}>
                        <EditRoundedIcon sx={{ fontSize : "20px" , color : "lightgray" , mt : "3px"}} />
                    </IconButton>
                </Box>
                <Typography>Gmail : {user.email}</Typography>
                <Divider variant="middle" sx={{ bgcolor : "black"}} />
                <Box sx={{ display : "flex" , justifyContent : "center"}}>
                    <Button variant="contained" sx={{bgcolor : "#7485E5"  , color : "black" , borderRadius : "10px" , textTransform : "none" , px : "21px" }} onClick={() => {
                        setAgendaOpen(true);
                    }}>Agenda</Button>
                </Box>
                <Divider variant="middle" sx={{ bgcolor : "black"}} />
                <Box sx={{ display : "flex" , justifyContent : "center"}}>
                    <Button variant="contained" sx={{bgcolor : "#7485E5" , color : "black"  , borderRadius : "10px" , textTransform : "none"}} onClick={() => {
                        localStorage.clear();
                        signOut({callbackUrl : "/intro/sign-up"})
                    }} >Sign Out</Button>
                </Box>
                <Agenda agendaOpen={agendaOpen} setAgendaOpen={setAgendaOpen} />
                <EditUser setUserEditUserOpen={setUserEditUserOpen} userEditUserOpen={userEditUserOpen} />
            </DialogContent>
        </Dialog>
    )
}

export default UserSetting;