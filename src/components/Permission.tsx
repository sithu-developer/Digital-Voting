import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, FormControlLabel, IconButton, InputAdornment, Switch, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Major } from "../../generated/prisma";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { changeAdminCodeAndLimit } from "@/store/slices/majorSlice";

interface Props {
    permissionOpen : boolean;
    setPermissionOpen : (value : boolean) => void;
}

const Permission = ({ permissionOpen , setPermissionOpen } : Props) => {
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const [ showAdminPassword , setShowAdminPassword ] = useState<boolean>(false);
    const [ adminCodeFromTyping , setAdminCodeFromTyping ] = useState<string>("");
    const [ adminCode , setAdminCode ] = useState<string>("");
    const [ isClose , setIsClose ] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(majorsAndAdmin.length) {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            setAdminCode(admin.passCode)
            setIsClose(admin.isTimeUp)
        }
    } , [majorsAndAdmin]);

    const handleIsTimeUp = () => {
        if(adminCode === adminCodeFromTyping) {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            dispatch(changeAdminCodeAndLimit({ ...admin , isTimeUp : isClose  , isSuccess : () => {
                setPermissionOpen(false);
                setAdminCodeFromTyping("");
                setShowAdminPassword(false);
                dispatch(openSnackBar({ open : true , message : `Voting is successfully ${isClose ? "closed" : "opened"} ` , severity : Severity.success}))
            } }))
        } else {
            dispatch(openSnackBar({ open : true , message : "Wrong admin code !" , severity : Severity.error}))
        }
    }

    
    return (
        <Dialog open={permissionOpen} onClose={() => {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            setIsClose(admin.isTimeUp);
            setPermissionOpen(false);
            setAdminCodeFromTyping("");
            setShowAdminPassword(false);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "10px"}} >
                <Typography variant="h5" sx={{ mb : "10px"}} >Close Voting</Typography>
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
                <Box>
                    <FormControlLabel control={<Switch checked={isClose} />} onChange={( _ , value) => setIsClose(value)} label="Close voting ?" />
                </Box>
                <Box sx={{ display : "flex" , gap : "10px" , justifyContent : "end"}} >
                    <Button variant="contained" sx={{ textTransform : "none"}} onClick={() => {
                        const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
                        setIsClose(admin.isTimeUp)
                        setPermissionOpen(false);
                        setAdminCodeFromTyping("");
                        setShowAdminPassword(false);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!adminCodeFromTyping} sx={{ textTransform : "none"}} onClick={handleIsTimeUp}  >Confirm</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default Permission;