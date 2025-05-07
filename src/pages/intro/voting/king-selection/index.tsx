import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material"
import { signOut } from "next-auth/react";
import Link from "next/link";

const KingSelectionPage = () => {
    const user = useAppSelector(store => store.userSlice.user);

    
    if(user)
    return (
        <Box>
            <Typography>{user.email}</Typography>
            <Typography>{user.name}</Typography>
            <Typography>{user.majorId}</Typography>
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

export default KingSelectionPage;