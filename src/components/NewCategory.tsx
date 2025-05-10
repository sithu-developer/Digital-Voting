import { useAppDispatch } from "@/store/hooks";
import { createNewCategory } from "@/store/slices/categoriesSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { Box, Button, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { useState } from "react";

interface Props {
    newCategoryOpen : boolean;
    setNewCategoryOpen : (value : boolean) => void;
}

const NewCategory = ({ newCategoryOpen , setNewCategoryOpen } : Props) => {
    const [ newCategory , setNewCategory ] = useState<string>("");
    const dispatch = useAppDispatch();

    const handleCreateNewCategory = () => {
        dispatch(createNewCategory({newCategory , isSuccess : () => {
            setNewCategoryOpen(false);
            setNewCategory("");
            dispatch(openSnackBar({open : true , message : "New Category is successfully created" , severity : Severity.success}))
        }}))
    }

    return (
        <Dialog open={newCategoryOpen} onClose={() => {
            setNewCategoryOpen(false);
            setNewCategory("");
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}} >
                <Typography variant="h5" color="info" >New Category</Typography>
                <TextField label="Name" onChange={(event) => setNewCategory(event.target.value)} />
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setNewCategoryOpen(false);
                        setNewCategory("");
                    }} >cancel</Button>
                    <Button variant="contained" disabled={!newCategory} onClick={handleCreateNewCategory} >Create</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewCategory;