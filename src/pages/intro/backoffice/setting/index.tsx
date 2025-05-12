import { useAppSelector } from "@/store/hooks";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const SettingPage = () => {
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const majors = majorsAndAdmin.filter(item => item.majorsOrAdmin !== "admin");
    const [ selectedMajorId , setSelectedMajorId ] = useState<number>(0);
    const [ newMajorOpen , setNewMajorOpen ] = useState<boolean>(false); // here
    const [ editMajorOpen , setEditMajorOpen ] = useState<boolean>(false);
    const [ deleteMajorOpen , setDeleteMajorOpen ] = useState<boolean>(false);

    console.log(majors)

    return (
        <Box sx={{ p : "20px" , display : "flex" , flexDirection : "column" , gap : "20px"}} >
            <Box sx={{ display :"flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Typography  variant="h5" >Admin : </Typography>
                <Button variant="contained" sx={{ textTransform : "none"}} >Edit Admin code & limit</Button>
            </Box>
            <Divider sx={{ bgcolor : "black"}} />
            <Box sx={{ display : "flex" , justifyContent : "space-between"}} >
                <Typography  variant="h5" >Majors :</Typography>
                <Button variant="contained" sx={{ textTransform : "none"}} onClick={() => setNewMajorOpen(true)} >Create New Major</Button>
            </Box>
            <Box sx={{ display :"flex" , justifyContent : "space-between" , gap : "10px" , alignItems : "center" }} >
                <FormControl fullWidth >
                  <InputLabel id="major-label">Majors</InputLabel>
                  <Select
                    labelId="major-label"
                    value={selectedMajorId}
                    label="Majors"
                    onChange={(event) => setSelectedMajorId(event.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: 'secondary.dark',
                          color: 'black',
                        },
                      },
                    }}
                  >
                    <MenuItem value={0}>Select Major first</MenuItem>
                    {majors.map(item => (
                        <MenuItem value={item.id}>{item.majorsOrAdmin}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display : "flex"}}>
                    <IconButton onClick={() => setEditMajorOpen(true) } >
                        <EditRoundedIcon sx={{ color : "black"}} />
                    </IconButton>
                    <IconButton onClick={() => {
                        setDeleteMajorOpen(true);
                    }} >
                        <DeleteOutlineRoundedIcon sx={{ color : "error.main"}} />
                    </IconButton>
                </Box>
            </Box>
            <Divider sx={{ bgcolor : "black"}} />
            <Box sx={{ display : "flex" , justifyContent : "center"}} >
                <Button variant="contained" onClick={() => {
                    localStorage.clear();
                    signOut({callbackUrl : "/intro"})
                }} >sing out</Button>
            </Box>
        </Box>
    )
}

export default SettingPage;