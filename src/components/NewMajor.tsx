import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { NewMajorItems } from "@/types/major";
import { Major } from "../../generated/prisma";
import { Severity } from "@/types/snackBar";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { createMajor } from "@/store/slices/majorSlice";

interface Props {
    newMajorOpen : boolean;
    setNewMajorOpen : (value : boolean) => void
}

const defaultNewMajor : NewMajorItems = { majorName : "" , majorCode : "" , quantity : 0 };

const NewMajor = ( { newMajorOpen , setNewMajorOpen } : Props) => {
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const [ showNewPassword , setShowNewPassword ] = useState<boolean>(false);
    const [ newMajor , setNewMajor ] = useState<NewMajorItems>(defaultNewMajor);
    const [ adminCodeFromTyping , setAdminCodeFromTyping ] = useState<string>("");
    const [ adminCode , setAdminCode ] = useState<string>("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(majorsAndAdmin.length) {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            setAdminCode(admin.passCode)
        }
    } , [majorsAndAdmin]);

    const handleCreateNewMajor = () => {
        if(adminCode === adminCodeFromTyping) {
            dispatch(changeIsLoading(true));
            dispatch(createMajor({...newMajor , isSuccess : () => {
                setAdminCodeFromTyping("")
                setNewMajor(defaultNewMajor)
                setNewMajorOpen(false);
                setShowPassword(false);
                setShowNewPassword(false);
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({open : true , message : "Successfully created new major." , severity : Severity.success}))
            }}))
        } else {
            dispatch(openSnackBar({open : true , message : "Wrong admin code !" , severity : Severity.error}));
        }
    }

    return (
        <Dialog open={newMajorOpen} onClose={() => {
            setAdminCodeFromTyping("")
            setNewMajor(defaultNewMajor)
            setNewMajorOpen(false);
            setShowPassword(false);
            setShowNewPassword(false);
        }}>
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "10px"}} >
                <Typography variant="h6" color="info" sx={{ mb : "10px"}} >New Major</Typography>
                <TextField
                    label="Admin code"
                    onChange={(event) => setAdminCodeFromTyping(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment : (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                              }
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon sx={{ fontSize : "20px"  }} /> : <VisibilityIcon sx={{ fontSize : "20px"}} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      },
                    }} 
                />
                <Divider />
                <TextField label="Major name" onChange={(event) => setNewMajor({...newMajor , majorName : event.target.value})} />
                <TextField 
                    label="Major code" 
                    onChange={(event) => setNewMajor({...newMajor , majorCode : event.target.value})} 
                    type={showNewPassword ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment : (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showNewPassword ? 'hide the password' : 'display the password'
                              }
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOffIcon sx={{ fontSize : "20px"  }} /> : <VisibilityIcon sx={{ fontSize : "20px"}} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      },
                    }}
                />
                <TextField label="Limit" type="number"  onChange={(event) => setNewMajor({...newMajor , quantity : Number(event.target.value)})}  />
                <Box sx={{ display : "flex" , gap : "10px" , justifyContent : "end" , mt : "10px"}} >
                    <Button variant="contained"  onClick={() => {
                        setAdminCodeFromTyping("")
                        setNewMajor(defaultNewMajor)
                        setNewMajorOpen(false);
                        setShowPassword(false);
                        setShowNewPassword(false);
                    }} >Cancel</Button>
                    <Button variant="contained" onClick={handleCreateNewMajor} disabled={!newMajor.majorName || !newMajor.majorCode || !newMajor.quantity || !adminCodeFromTyping} >Create</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewMajor;