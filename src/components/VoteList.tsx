import { useAppSelector } from "@/store/hooks";
import { Box, Dialog, DialogTitle, Divider, IconButton, TextField, Typography } from "@mui/material"
import { VoteListItems } from "@/types/student";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState } from "react";

interface Props {
    voteListItems : VoteListItems,
    setVoteListItems : ( value : VoteListItems ) => void;
}

const VoteList = ( { voteListItems , setVoteListItems } : Props ) => {
    const [ showSearch , setShowSearch ] = useState<boolean>(false);
    const [ searchGmail , setSearchGamil ] = useState<string>("")
    const votes = useAppSelector(store => store.votesSlice.votes);
    const users = useAppSelector(store => store.userSlice.usersFromAdmin);
    const relatedUserIds = votes.filter(item => item.studentId === voteListItems.selectedStudentId).map(item => item.userId);
    const relatedUsers = users.filter(item => relatedUserIds.includes(item.id));
    const sortedRelatedUsers = relatedUsers.filter(item => item.email.toLowerCase().includes(searchGmail.toLowerCase()));

    return (
        <Dialog open={voteListItems.open} onClose={() => {
            setSearchGamil("");
            setShowSearch(false);
            setVoteListItems({...voteListItems , open : false});
        }} >
                <DialogTitle sx={{  display : "flex" , justifyContent : "space-between" , alignItems : "center" , bgcolor : "secondary.light"  }}>
                    {!showSearch && <Typography color="info" sx={{ fontSize : "20px" , fontWeight : 600}} >{voteListItems.name + "\'s voters.."}</Typography>}
                    {showSearch && <TextField autoFocus onChange={(event) => setSearchGamil(event.target.value) } variant="standard" placeholder="Search gmail.." />}
                    <Box sx={{ display : "flex"}} >
                        {!showSearch && <IconButton onClick={() => setShowSearch(true)} >
                            <SearchRoundedIcon sx={{ color : "black"}}  />
                        </IconButton>}
                        <IconButton onClick={() => {
                            setSearchGamil("");
                            setShowSearch(false);
                            setVoteListItems({...voteListItems , open : false});
                        }} >
                            <CloseRoundedIcon sx={{ color : "black"}}  />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box sx={{ display : "flex" , flexDirection : "column" , bgcolor : "secondary.main" , width : "85vw" , maxHeight : "500px" , overflowY : "auto"}}>
                    {sortedRelatedUsers.length ? sortedRelatedUsers.map(item => (
                        <Box key={item.id} >
                            <Box sx={{ p : "10px" , display : "flex" , alignItems : "center" , gap : "10px" }}>
                                <Typography color="info" >{relatedUsers.indexOf(item)+1}.</Typography>
                                <Box>
                                    <Typography sx={{ lineHeight : 1 , color : "black" }} >Name : {item.name}</Typography>
                                    <Typography sx={{ color : "black"}} >Gmail : {item.email}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ bgcolor : "black"}} variant="middle" />
                        </Box>
                    ))
                    :<Typography sx={{ p : "20px" , textAlign : "center"}} variant="h6" color="info" >No vote yet</Typography>}
                </Box>
        </Dialog>
    )
}

export default VoteList;