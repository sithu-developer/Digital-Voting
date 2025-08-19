import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Major } from "../../generated/prisma";
import { AdminFromTyping } from "@/types/major";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { changeAdminCodeAndLimit } from "@/store/slices/majorSlice";

interface Props {
    changeAdminCodeAndLimitOpen : boolean;
    setChangeAdminCodeAndLimitOpen : (value : boolean) => void
}

const defaultAdminFromTyping : AdminFromTyping = { newLimit : 0 , newAdminCodeFromTyping : "" , oldAdminCodeFromTyping : "" };

const ChangeAdminCodeAndLimit = ( { changeAdminCodeAndLimitOpen , setChangeAdminCodeAndLimitOpen } : Props) => {
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const [ changedAdmin , setChangedAdmin ] = useState<Major>();
    const [ adminFromTyping , setAdminFromTyping ] = useState<AdminFromTyping>(defaultAdminFromTyping);
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const [ showNewPassword , setShowNewPassword ] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(majorsAndAdmin.length) {
            const admin = majorsAndAdmin.find(item => item.majorsOrAdmin === "admin") as Major ;
            setChangedAdmin(admin);
            setAdminFromTyping(prev => ({...prev , newAdminCodeFromTyping : "" , oldAdminCodeFromTyping : "" , newLimit : admin.maxQuantity }));
        }
    } , [majorsAndAdmin])

    if(!changedAdmin) return null;

    const handleChangeAdmin = () => {
        if(changedAdmin.passCode === adminFromTyping.oldAdminCodeFromTyping) {
            dispatch(changeIsLoading(true));
            dispatch(changeAdminCodeAndLimit({...changedAdmin , maxQuantity : adminFromTyping.newLimit , passCode : adminFromTyping.newAdminCodeFromTyping , isSuccess : () => {
                setChangeAdminCodeAndLimitOpen(false);
                setShowPassword(false);
                setShowNewPassword(false);
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({open : true , message : "Successfully changed Admin code" , severity : Severity.success}))
                localStorage.setItem("adminPassword" , adminFromTyping.newAdminCodeFromTyping)
            }}))
        } else {
            dispatch(openSnackBar({open : true , message : "Wrong old admin code !" , severity : Severity.error}))
        }
    }

    return (
        <Dialog open={changeAdminCodeAndLimitOpen} onClose={() => {
            setChangeAdminCodeAndLimitOpen(false);
            setAdminFromTyping({...defaultAdminFromTyping ,newLimit : changedAdmin.maxQuantity});
            setShowPassword(false);
            setShowNewPassword(false);
        }}>
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "10px"}} >
                <Typography variant="h6" color="info" sx={{ mb : "10px"}} >Change Admin code & Limit</Typography>
                <TextField
                    label="Old Admin code"
                    onChange={(event) => setAdminFromTyping({...adminFromTyping , oldAdminCodeFromTyping : event.target.value})}
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
                <TextField 
                    label="New Admin code" 
                    onChange={(event) => setAdminFromTyping({...adminFromTyping , newAdminCodeFromTyping : event.target.value})} 
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
                <TextField label="Limit" type="number" defaultValue={adminFromTyping.newLimit} onChange={(event) =>  setAdminFromTyping({...adminFromTyping , newLimit : Number(event.target.value)})} />
                <Box sx={{ display : "flex" , gap : "10px" , justifyContent : "end" , mt : "10px"}} >
                    <Button variant="contained"  onClick={() => {
                        setChangeAdminCodeAndLimitOpen(false);
                        setAdminFromTyping({...defaultAdminFromTyping ,newLimit : changedAdmin.maxQuantity});
                        setShowPassword(false);
                        setShowNewPassword(false);
                    }} >Cancel</Button>
                    <Button variant="contained" onClick={handleChangeAdmin} disabled={!adminFromTyping.newLimit || !adminFromTyping.newAdminCodeFromTyping || !adminFromTyping.oldAdminCodeFromTyping} >Change</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
    
}

export default ChangeAdminCodeAndLimit;