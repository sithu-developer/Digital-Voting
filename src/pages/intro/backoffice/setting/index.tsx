import { Box, Button } from "@mui/material";
import { signOut } from "next-auth/react";

const SettingPage = () => {
    return (
        <Box>
            <Button variant="contained" onClick={() => {
                localStorage.clear();
                signOut({callbackUrl : "/intro"})
            }} >sing out</Button>
        </Box>
    )
}

export default SettingPage;