import { Box } from "@mui/material"
import { ReactNode } from "react";
import BackofficeTopBar from "./BackofficeTopBar";
import { useRouter } from "next/router";
import SnackBarComp from "./SnackBar";
import VotingBottomBar from "./VotingBottomBar";
import { useAppSelector } from "@/store/hooks";

interface Props {
    children : ReactNode;
}

const Layout = ({ children } : Props ) => {
    const router = useRouter();
    const admin = useAppSelector(store => store.adminSlice.admin);
    const user = useAppSelector(store => store.userSlice.user);
    const path = router.asPath;
    const isBackoffice = path.includes("/intro/backoffice");
    const isVotingPage = path.includes("/intro/voting");

    return (
        <Box>
           {isBackoffice && <BackofficeTopBar />}
            {children}
            {isVotingPage && <VotingBottomBar />}
            <SnackBarComp />
        </Box>
    )
}

export default Layout;