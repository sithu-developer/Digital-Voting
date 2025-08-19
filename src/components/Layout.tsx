import { Box } from "@mui/material"
import { ReactNode, useState } from "react";
import BackofficeTopBar from "./BackofficeTopBar";
import { useRouter } from "next/router";
import SnackBarComp from "./SnackBar";
import VotingSetting from "./VotingSetting";
import BackofficeSideBar from "./BackofficeSideBar";
import Loading from "./Loading";

interface Props {
    children : ReactNode;
}

const Layout = ({ children } : Props ) => {
    const router = useRouter();
    const path = router.asPath;
    const isBackoffice = path.includes("/intro/backoffice");
    const isVotingPage = path.includes("/intro/voting");
    const [ sideBarOpen , setSideBarOpen ] = useState<boolean>(false);

    return (
        <Box  sx={{ bgcolor : "secondary.main" , position : "relative" , pt :( isBackoffice ? "30px" : "0px") , width : "100vw" , height : "100vh", overflowY : "auto" }}>
           {isBackoffice && <Box sx={{ display : "flex" , justifyContent : "center"}}>
                <BackofficeTopBar setSideBarOpen={setSideBarOpen} />
           </Box>}
           {isBackoffice && <BackofficeSideBar setSideBarOpen={setSideBarOpen} sideBarOpen={sideBarOpen} />}
            <Box>{children}</Box>
            {isVotingPage && <VotingSetting />}
            <SnackBarComp />
            <Loading />
        </Box>
    )
}

export default Layout;