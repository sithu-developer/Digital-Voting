import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewAdmin } from "@/store/slices/adminSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const KingQueenPage = () => {
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
        if(password && session && session.user){
            dispatch(createNewAdmin({ password , email : String(session.user.email) , isFail : () => {
                router.push("/intro")
                console.log("to")
                dispatch(openSnackBar({ open : true , message : "Wrong password or limit exceeded!" , severity : Severity.error}))
            } }))
        } else {
            const interval = setInterval(() => {
                router.push("/intro")
            } , 15000)
            return () => {
                clearInterval(interval);
            }
        }
        
    } , [password , session])

    if(admin) 
    return (
        <Box>
            <Typography>King queen page</Typography>
            <Typography>{password}</Typography>
            <Typography>{session?.user?.email} /</Typography>
            <Button variant="contained" onClick={() => {
                localStorage.clear();
                signOut({callbackUrl : "/intro"})
            }} >sing out</Button>
        </Box>
    )
    else 
    return (
        <Box>
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default KingQueenPage;