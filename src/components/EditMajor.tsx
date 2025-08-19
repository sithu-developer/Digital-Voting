import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { UpdatedMajorItems } from "@/types/major";
import { Major } from "../../generated/prisma";
import { Severity } from "@/types/snackBar";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { updateMajor } from "@/store/slices/majorSlice";

interface Props {
    selectedMajorId : number;
    editMajorOpen : boolean;
    setEditMajorOpen : (value : boolean) => void
}

const EditMajor = ( { selectedMajorId , editMajorOpen , setEditMajorOpen } : Props) => {
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const [ showAdminPassword , setShowAdminPassword ] = useState<boolean>(false);
    const [ showMajorPassword , setShowMajorPassword ] = useState<boolean>(false);
    const [ updatedMajor , setUpdatedMajor ] = useState<UpdatedMajorItems>();
    const [ adminCodeFromTyping , setAdminCodeFromTyping ] = useState<string>("");
    const [ adminCode , setAdminCode ] = useState<string>("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(majorsAndAdmin.length && selectedMajorId) {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            const selectedMajor = majorsAndAdmin.find(item => item.id === selectedMajorId) as Major;
            setAdminCode(admin.passCode)
            setUpdatedMajor(selectedMajor)
        }
    } , [majorsAndAdmin , selectedMajorId]);

    if(!updatedMajor) return null;

    const handleUpdateMajor = () => {
        if(adminCode === adminCodeFromTyping) {
            dispatch(changeIsLoading(true));
            dispatch(updateMajor({...updatedMajor , isSuccess : () => {
                setAdminCodeFromTyping("")
                setEditMajorOpen(false);
                setShowAdminPassword(false);
                setShowMajorPassword(false);
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({open : true , message : "Successfully updated !" , severity : Severity.success}));
            }}))
        } else {
            dispatch(openSnackBar({open : true , message : "Wrong admin code !" , severity : Severity.error}));
        }
    }

    return (
        <Dialog open={editMajorOpen} onClose={() => {
            const selectedMajor = majorsAndAdmin.find(item => item.id === selectedMajorId) as Major;
            setUpdatedMajor(selectedMajor);
            setAdminCodeFromTyping("")
            setEditMajorOpen(false);
            setShowAdminPassword(false);
            setShowMajorPassword(false);
        }}>
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "10px"}} >
                <Typography variant="h6" color="info" sx={{ mb : "10px"}} >Edit Major</Typography>
                <TextField
                    label="Admin code"
                    onChange={(event) => setAdminCodeFromTyping(event.target.value)}
                    type={showAdminPassword ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment : (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showAdminPassword ? 'hide the password' : 'display the password'
                              }
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              edge="end"
                            >
                              {showAdminPassword ? <VisibilityOffIcon sx={{ fontSize : "20px"  }} /> : <VisibilityIcon sx={{ fontSize : "20px"}} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      },
                    }} 
                />
                <Divider />
                <TextField label="Major name" defaultValue={updatedMajor.majorsOrAdmin} onChange={(event) => setUpdatedMajor({...updatedMajor , majorsOrAdmin : event.target.value})} />
                <TextField 
                    defaultValue={updatedMajor.passCode}
                    label="Major code" 
                    onChange={(event) => setUpdatedMajor({...updatedMajor , passCode : event.target.value})} 
                    type={showMajorPassword ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment : (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showMajorPassword ? 'hide the password' : 'display the password'
                              }
                              onClick={() => setShowMajorPassword(!showMajorPassword)}
                              edge="end"
                            >
                              {showMajorPassword ? <VisibilityOffIcon sx={{ fontSize : "20px"  }} /> : <VisibilityIcon sx={{ fontSize : "20px"}} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      },
                    }}
                />
                <TextField defaultValue={updatedMajor.maxQuantity} label="Limit" type="number"  onChange={(event) => setUpdatedMajor({...updatedMajor , maxQuantity : Number(event.target.value)})}  />
                <Box sx={{ display : "flex" , gap : "10px" , justifyContent : "end" , mt : "10px"}} >
                    <Button variant="contained"  onClick={() => {
                        const selectedMajor = majorsAndAdmin.find(item => item.id === selectedMajorId) as Major;
                        setUpdatedMajor(selectedMajor);
                        setAdminCodeFromTyping("")
                        setEditMajorOpen(false);
                        setShowAdminPassword(false);
                        setShowMajorPassword(false);
                    }} >Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateMajor} disabled={!updatedMajor.majorsOrAdmin || !updatedMajor.passCode || !updatedMajor.maxQuantity || !adminCodeFromTyping} >Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default EditMajor;