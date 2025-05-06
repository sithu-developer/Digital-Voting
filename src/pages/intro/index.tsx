import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IntroPage = () => {

    const router = useRouter();
    
      useEffect(() => {
        router.push("/intro/sign-up")
      } , [])

    return (
        <Box>
            Intro page
        </Box>
    )
}

export default IntroPage;