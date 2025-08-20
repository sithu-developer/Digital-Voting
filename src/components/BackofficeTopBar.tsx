import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewAdmin } from "@/store/slices/adminSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { Box, IconButton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Image from "next/image";

interface Props {
    setSideBarOpen : ( value : boolean ) => void;
}

const BackofficeTopBar = ({ setSideBarOpen } : Props ) => {
    const { data : session } = useSession();
    const [ password , setPassword ] = useState<string>("");
    const dispatch = useAppDispatch();
    const router = useRouter();
    const admin = useAppSelector(store => store.adminSlice.admin);

    useEffect(() => {
        if(localStorage) {
            const password = String(localStorage.getItem("adminPassword"));
            setPassword(password)
        }
    } , [] )

    useEffect(() => {
        if(!admin) {
            if(password && session && session.user && dispatch && router){
                dispatch(createNewAdmin({ password , email : String(session.user.email) , isFail : (err) => {
                    router.push("/intro/sign-up")
                    dispatch(openSnackBar({ open : true , message : String(err) , severity : Severity.error}))
                } }))
            } else {
                const interval = setInterval(() => {
                    router.push("/intro/sign-up")
                } , 15000)
                return () => {
                    clearInterval(interval);
                }
            }
        }
    } , [password , session , dispatch , router , admin])
    
    if(!admin) return null;
    return (
        <Box sx={{ bgcolor : "info.main" , position : "relative" , width : "95%" , height : "50px" , borderRadius : "8px", display : "flex" , justifyContent : "space-between" , alignItems : "center" , px : "8px"}} >
            <IconButton onClick={() => setSideBarOpen(true)} >
                <MenuRoundedIcon sx={{ color : "white" , fontSize : "32px"}}  />
            </IconButton>
            <Typography sx={{ mt : "10px"}}>Admin</Typography>
            <Image alt="Digital-voting-logo" src={"/Digital Voting-logo-transparent.png"} width={300} height={300} style={{ width : "auto" , height : "100%"}} />
            <Box sx={{ bgcolor : "secondary.main" , position : "absolute" , top : "-25px" , left : "50%" , transform: 'translateX(-50%)',  justifySelf : "center" , clipPath: 'polygon(-5% 0%, 105% 0%, 80% 100%, 20% 100%)' , width : "90px" , height : "40px" , display : "flex" , justifyContent : "center" , alignItems : "center"  }}> 
                <Image alt="king crown logo" src={"/kingCrownLogo.png"} width={200} height={200} style={{ width : "50px" , height : "50px"}} />
            </Box>
        </Box>
    )
}

export default BackofficeTopBar;