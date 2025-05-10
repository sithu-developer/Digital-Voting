import { Box } from "@mui/material"
import { ReactNode, useState } from "react";
import BackofficeTopBar from "./BackofficeTopBar";
import { useRouter } from "next/router";
import SnackBarComp from "./SnackBar";
import VotingBottomBar from "./VotingBottomBar";
import BackofficeSideBar from "./BackofficeSideBar";

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
        <Box  sx={{ bgcolor : "secondary.main" , pt :( isBackoffice ? "30px" : "0px") , width : "100vw" , height : "100vh" , overflow : "hidden" , overflowY : "auto" }}>
           {isBackoffice && <BackofficeTopBar setSideBarOpen={setSideBarOpen} />}
           {isBackoffice && <BackofficeSideBar setSideBarOpen={setSideBarOpen} sideBarOpen={sideBarOpen} />}
            <Box>{children}</Box>
            {isVotingPage && <VotingBottomBar />}
            <SnackBarComp />
        </Box>
    )
}

export default Layout;