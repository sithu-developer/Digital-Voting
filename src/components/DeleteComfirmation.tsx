import { Box, Button, Dialog, DialogContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { Categories, Major, Students } from "../../generated/prisma";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { deleteCategory } from "@/store/slices/categoriesSlice";
import { deleteStudent } from "@/store/slices/studentsSlice";
import { useRouter } from "next/router";
import { deleteMajor } from "@/store/slices/majorSlice";

interface Props {
    deleteOpen : boolean;
    setDeleteOpen : (value : boolean) => void
    categoryToDelete ?: Categories
    studentToDelete ?: Students
    majorIdToDelete ?: number 
    setSelectedMajorId ?: (value : number) => void
}

const DeleteComfirmation = ({ deleteOpen , setDeleteOpen , categoryToDelete , studentToDelete , majorIdToDelete , setSelectedMajorId } : Props ) => {
    const [ adminCodeFromLocalStrage , setAdminCodeFromLocalStrage ] = useState<string>("");
    const [ adminCodeFromTyping , setAdminCodeFromTyping ] = useState<string>("");
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const [ majorToDelete , setMajorToDelete ] = useState<Major>();
    const majorsAndAdmin = useAppSelector(store => store.majorsSlice.majors);
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    useEffect(() => {
        if(majorIdToDelete && majorsAndAdmin.length) {
            const selectedMajor = majorsAndAdmin.find(item => item.id === majorIdToDelete);
            setMajorToDelete(selectedMajor)
        }
    } , [majorIdToDelete , majorsAndAdmin])

    useEffect(() => {
        if(localStorage) {
            setAdminCodeFromLocalStrage(String(localStorage.getItem("adminPassword")));
        }
    } , []) 


    
    const handleDeleteCategory = () => {
        if(categoryToDelete) {
            if(adminCodeFromLocalStrage === adminCodeFromTyping) {
                dispatch(changeIsLoading(true));
                dispatch(deleteCategory({categoryId : categoryToDelete.id , isSuccess : () => {
                    setAdminCodeFromTyping("");
                    setShowPassword(false);
                    setDeleteOpen(false);
                    dispatch(changeIsLoading(false));
                    dispatch(openSnackBar({open : true , message : "Successfully deleted" , severity : Severity.success}))
                } }))
            } else {
                dispatch(openSnackBar({open : true , message : "Wrong admin passcode !" , severity : Severity.error}))
            }
        }
    }

    const handleDeleteStudent = () => {
        if(studentToDelete) {
            dispatch(changeIsLoading(true));
            dispatch(deleteStudent({studentId : studentToDelete.id , isSuccess : () => {
                setShowPassword(false);
                setDeleteOpen(false);
                router.push("/intro/backoffice/king-queen")
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({ open : true , message : "Successfully deleted to this student" , severity : Severity.success}))
            }}))

        }
    }

    const handleDeleteMajor = () => {
        if(majorToDelete) {
            if(adminCodeFromLocalStrage === adminCodeFromTyping) {
                dispatch(changeIsLoading(true));
                dispatch(deleteMajor({majorId : majorToDelete.id , isSuccess : () => {
                    setAdminCodeFromTyping("");
                    setShowPassword(false);
                    setDeleteOpen(false);
                    if(setSelectedMajorId) {
                        setSelectedMajorId(0);
                    };
                    dispatch(changeIsLoading(false));
                    dispatch(openSnackBar({ open : true , message : "Successfully deleted to this major" , severity : Severity.success }))
                }}))
            } else {
                dispatch(openSnackBar({open : true , message : "Wrong admin passcode !" , severity : Severity.error}))
            }
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
                {studentToDelete && <Typography color="info" >Are you sure that you want to delete this student({studentToDelete.name}) ?</Typography>}
                {majorToDelete && <Typography color="info" >Note : Deleting this major( {majorToDelete.majorsOrAdmin} ) will also delete all the users related to that major</Typography> }
                {(categoryToDelete || majorToDelete) && <TextField 
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
                    {categoryToDelete && <Button variant="contained" color="error" disabled={!adminCodeFromTyping} onClick={handleDeleteCategory} >Delete</Button>}
                    {studentToDelete && <Button variant="contained" color="error" onClick={handleDeleteStudent} >Delete</Button>}
                    {majorToDelete && <Button variant="contained" color="error" disabled={!adminCodeFromTyping} onClick={handleDeleteMajor} >Delete</Button>}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteComfirmation;