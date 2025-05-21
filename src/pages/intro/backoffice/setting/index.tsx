import { useAppSelector } from "@/store/hooks";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ChangeAdminCodeAndLimit from "@/components/ChangeAdminCodeAndLimit";
import Link from "next/link";
import NewMajor from "@/components/NewMajor";
import EditMajor from "@/components/EditMajor";
import DeleteComfirmation from "@/components/DeleteComfirmation";
import Permission from "@/components/Permission";

const SettingPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const majors = majorsAndAdmin.filter(item => item.majorsOrAdmin !== "admin");
    const [ selectedMajorId , setSelectedMajorId ] = useState<number>(0);
    const [ newMajorOpen , setNewMajorOpen ] = useState<boolean>(false);
    const [ editMajorOpen , setEditMajorOpen ] = useState<boolean>(false);
    const [ deleteMajorOpen , setDeleteMajorOpen ] = useState<boolean>(false);
    const [ changeAdminCodeAndLimitOpen , setChangeAdminCodeAndLimitOpen ] = useState<boolean>(false);
    const [ permissionOpen , setPermissionOpen ] = useState<boolean>(false);



    if(admin)
    return (
        <Box sx={{ p : "20px" , display : "flex" , flexDirection : "column" , gap : "30px"}} >
            <Box sx={{ display :"flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Typography  variant="h5" >Admin : </Typography>
                <Button onClick={() => setChangeAdminCodeAndLimitOpen(true) } variant="contained" sx={{ textTransform : "none"}} >Change Admin code & limit</Button>
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
                          backgroundColor: 'secondary.light',
                        },
                      },
                    }}
                  >
                    <MenuItem value={0} sx={{ color : "black"}} >Select Major first</MenuItem>
                    {majors.map(item => (
                        <MenuItem key={item.id} value={item.id} sx={{ color : "black"}} >{item.majorsOrAdmin}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display : "flex"}}>
                    <IconButton disabled={!selectedMajorId} onClick={() => setEditMajorOpen(true) } >
                        <EditRoundedIcon sx={{ color :( selectedMajorId ? "black" : "gray" )}} />
                    </IconButton>
                    <IconButton disabled={!selectedMajorId} onClick={() => {
                        setDeleteMajorOpen(true);
                    }} >
                        <DeleteOutlineRoundedIcon sx={{ color : ( selectedMajorId ? "error.main" : "gray" )}} />
                    </IconButton>
                </Box>
            </Box>
            <Divider sx={{ bgcolor : "black"}} />
            <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "20px"}} >
                <Typography variant="h5" >To Control Voting</Typography>
                <Button variant="contained" sx={{ textTransform : "none"}} onClick={() => setPermissionOpen(true)} >Close Voting</Button>
            </Box>
            <Divider sx={{ bgcolor : "black"}} />
            <Box sx={{ display : "flex" , justifyContent : "center"}} >
                <Button variant="contained"  sx={{ textTransform : "none"}} onClick={() => {
                    localStorage.clear();
                    signOut({callbackUrl : "/intro/sign-up"})
                }} >Sign Out</Button>
            </Box>
            <Permission permissionOpen={permissionOpen} setPermissionOpen={setPermissionOpen} />
            <ChangeAdminCodeAndLimit changeAdminCodeAndLimitOpen={changeAdminCodeAndLimitOpen} setChangeAdminCodeAndLimitOpen={setChangeAdminCodeAndLimitOpen} />
            <NewMajor newMajorOpen={newMajorOpen} setNewMajorOpen={setNewMajorOpen} />
            {selectedMajorId ? <EditMajor selectedMajorId={selectedMajorId} editMajorOpen={editMajorOpen} setEditMajorOpen={setEditMajorOpen} /> : null}
            {selectedMajorId ? <DeleteComfirmation deleteOpen={deleteMajorOpen} setDeleteOpen={setDeleteMajorOpen} majorIdToDelete={selectedMajorId} setSelectedMajorId={setSelectedMajorId} /> : null}
        </Box>
    )
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro/sign-up"} >Click here</Link></Typography>
        </Box>
    )
}

export default SettingPage;