import { Box, IconButton } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { createNewUser } from "@/store/slices/userSlice";
import { Severity } from "@/types/snackBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import UserSetting from "./userSetting";


const VotingSetting = () => {
    const [ majorCode , setMajorCode ] = useState<string>("");
    const [ userSettingOpen , setUserSettingOpen ] = useState<boolean>(false);
    const { data : session } = useSession();
    const dispatch = useAppDispatch();
    const user = useAppSelector(store => store.userSlice.user);
    const router = useRouter();
    const path = router.asPath;

    useEffect(() => {
        if(localStorage) {
            const majorCode = String(localStorage.getItem("majorCode"));
            setMajorCode(majorCode)
        }
    } , [] )

    useEffect(() => {
        if(!user) {
            if(majorCode && session && session.user && dispatch && router){
                dispatch(createNewUser({ majorCode , email : String(session.user.email) , isFail : (err) => {
                    router.push("/intro/sign-up")
                    dispatch(openSnackBar({ open : true , message : String(err) , severity : Severity.error}))
                }}))
            } else {
                const interval = setInterval(() => {
                    router.push("/intro/sign-up")
                } , 15000)
                return () => {
                    clearInterval(interval);
                }
            }
        }
    } , [majorCode , session , dispatch , router , user ])
    
    if(!user || path === "/intro/voting/results") return null;
    return (
        <Box sx={{ position : "absolute" , top : "17px" , right : "11px" , color : "white"}} >
            <IconButton onClick={() => setUserSettingOpen(true)} >
                <SettingsRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
            </IconButton>
            <UserSetting userSettingOpen={userSettingOpen} setUserSettingOpen={setUserSettingOpen} />
        </Box>
    )
}

export default VotingSetting;