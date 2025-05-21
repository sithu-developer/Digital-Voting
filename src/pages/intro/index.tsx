import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IntroPage = () => {

    const router = useRouter();
    
      useEffect(() => {
        if(router) {
          router.push("/intro/sign-up");
        }
      } , [router])

    return (
        <Box>
            Intro page
        </Box>
    )
}

export default IntroPage;