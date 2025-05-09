import { Box, Button, Dialog, DialogContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { Categories, Students } from "../../generated/prisma";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from "@/store/hooks";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { deleteCategory } from "@/store/slices/categoriesSlice";

interface Props {
    deleteOpen : boolean;
    setDeleteOpen : (value : boolean) => void
    categoryToDelete ?: Categories
    studentToDelete ?: Students
}

const DeleteComfirmation = ({ deleteOpen , setDeleteOpen , categoryToDelete , studentToDelete } : Props ) => {
    const [ adminCodeFromLocalStrage , setAdminCodeFromLocalStrage ] = useState<string>("");
    const [ adminCodeFromTyping , setAdminCodeFromTyping ] = useState<string>("");
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(localStorage) {
            setAdminCodeFromLocalStrage(String(localStorage.getItem("adminPassword")));
        }
    } , []) 


    
    const handleDelete = () => {
        if(categoryToDelete) {
            if(adminCodeFromLocalStrage === adminCodeFromTyping) {
                dispatch(deleteCategory({categoryId : categoryToDelete.id , isSuccess : () => {
                    setAdminCodeFromTyping("");
                    setShowPassword(false);
                    setDeleteOpen(false);
                    dispatch(openSnackBar({open : true , message : "Successfully deleted" , severity : Severity.success}))
                } }))
            } else {
                dispatch(openSnackBar({open : true , message : "Wrong admin passcode!" , severity : Severity.error}))
            }
        }
        if(studentToDelete) {
            // delete student dispatch here
        }
    }


    return (
        <Dialog open={deleteOpen} onClose={() => {
            setAdminCodeFromTyping("");
            setShowPassword(false);
            setDeleteOpen(false);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}}  >
                <Typography variant="h5" color="error" >Delete</Typography>
                {categoryToDelete && <Typography color="info" >Note : Deleting this category( {categoryToDelete.name} ) will also delete all the students related to that category</Typography>}
                {studentToDelete && <Typography color="info" >Are you sure to delete this student({studentToDelete.name})</Typography>}
                {categoryToDelete && <TextField 
                    label="Enter Admin Code" 
                    defaultValue={adminCodeFromTyping} 
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
                />}
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setAdminCodeFromTyping("");
                        setShowPassword(false);
                        setDeleteOpen(false);
                    }} >Cancel</Button>
                    <Button variant="contained" color="error" disabled={!adminCodeFromTyping} onClick={handleDelete} >Delete</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteComfirmation;