import { Box } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { createNewUser } from "@/store/slices/userSlice";
import { Severity } from "@/types/snackBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VotingBottomBar = () => {
    const [ majorCode , setMajorCode ] = useState<string>("");
    const { data : session } = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(store => store.userSlice.user);

    useEffect(() => {
        if(localStorage) {
            const majorCode = String(localStorage.getItem("majorCode"));
            setMajorCode(majorCode)
        }
    } , [] )

    useEffect(() => {
        if(majorCode && session && session.user){
            dispatch(createNewUser({ majorCode , email : String(session.user.email) , isFail : (err) => {
                router.push("/intro")
                dispatch(openSnackBar({ open : true , message : String(err) , severity : Severity.error}))
            }}))
        } else {
            const interval = setInterval(() => {
                router.push("/intro")
            } , 15000)
            return () => {
                clearInterval(interval);
            }
        }
    } , [majorCode , session])
    
    if(!user) return null;
    return (
        <Box sx={{ position : "absolute" , top : "20px" , right : "20px" , color : "white"}} >bottom bar</Box>
    )
}

export default VotingBottomBar;