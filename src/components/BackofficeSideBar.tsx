import { SideBarListItemType } from "@/types/general";
import { Box, Divider, Drawer, IconButton } from "@mui/material"
import Link from "next/link";
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Groups3RoundedIcon from '@mui/icons-material/Groups3Rounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import { useRouter } from "next/router";

interface Props {
    sideBarOpen : boolean,
    setSideBarOpen : ( value : boolean ) => void;
}

const BackofficeSideBar = ({ setSideBarOpen , sideBarOpen } : Props ) => {
    const router = useRouter();
    const path = router.asPath;
    
    return (
        <Drawer open={sideBarOpen} onClose={() => setSideBarOpen(false)} 
            slotProps={{
                paper : {
                    sx : {
                        ml : "10px",
                        height : "fit-content",
                        top : "100px",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius : "5px",
                        border: "1px solid white",
                        backdropFilter : "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        p : "5px",
                    }
                }
            }}
            ModalProps={{
              BackdropProps: {
                style: {
                  backgroundColor: 'transparent', 
                },
              },
            }}
        >
        <Box sx={{ display : "flex" , flexDirection : "column" , gap : "5px"}} >
            {sideBarListItems.slice(0 , -1).map(item => (
                <Link key={item.id} href={item.href} style={{ textDecoration : "none"}} >
                    <IconButton>
                        <item.icon sx={{ fontSize : "27px" , color : (path.includes(item.href) ? "white" :  "black") }} />
                    </IconButton>
                </Link>
            ))}
            <Divider sx={{ bgcolor : "black"}} />
            {sideBarListItems.slice(-1 , sideBarListItems.length).map(item => (
                <Link key={item.id} href={item.href} style={{ textDecoration : "none"}} >
                    <IconButton>
                        <item.icon sx={{ fontSize : "27px" , color : (path.includes(item.href) ? "white" :  "black") }} />
                    </IconButton>
                </Link>
            ))}
        </Box>
        </Drawer>
    )
}

export default BackofficeSideBar;


const sideBarListItems : SideBarListItemType[] = [
    {
        id : 1 ,
        href : "/intro/backoffice/king-queen",
        icon : Groups3RoundedIcon
    },
    {
        id : 2 ,
        href : "/intro/backoffice/agenda",
        icon : EventNoteRoundedIcon
    },
    {
        id : 3 ,
        href : "/intro/backoffice/result",
        icon : EmojiEventsRoundedIcon
    },
    {
        id : 4 ,
        href : "/intro/backoffice/setting",
        icon : SettingsRoundedIcon
    },
    
]