import { Box, Button, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { Categories } from "../../generated/prisma";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateCategory } from "@/store/slices/categoriesSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";

interface Props {
    selectedCategory : Categories
    editCategoryOpen : boolean;
    setEditCategoryOpen : (value : boolean) => void;
}

const EditCategory = ({ selectedCategory , editCategoryOpen ,setEditCategoryOpen } : Props) => {
    const [ editedCategory , setEditedCategory ] = useState<Categories>(selectedCategory);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(selectedCategory) {
            setEditedCategory(selectedCategory)
        }
    } , [selectedCategory])


    const handleUpdateCategory = () => {
        dispatch(updateCategory({ updatedCategory : editedCategory , isSuccess : () => {
            dispatch(openSnackBar({open : true , message : `Successfully updated from ${selectedCategory.name} to ${editedCategory.name}` , severity  : Severity.success}))
            setEditCategoryOpen(false);
            setEditedCategory(editedCategory);
        }}))
    }

    return (
        <Dialog open={editCategoryOpen} onClose={() => {
            setEditCategoryOpen(false);
            setEditedCategory(selectedCategory);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}} >
                <Typography variant="h5" >Rename category</Typography>
                <TextField label={"name"} defaultValue={selectedCategory.name} onChange={(event) => setEditedCategory({...editedCategory , name : event.target.value}) } />
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setEditCategoryOpen(false);
                        setEditedCategory(selectedCategory);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!editedCategory.name} onClick={handleUpdateCategory} >Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default EditCategory;