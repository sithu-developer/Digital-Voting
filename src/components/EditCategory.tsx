import { Box, Button, Chip, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { Categories } from "../../generated/prisma";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateCategory } from "@/store/slices/categoriesSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { uploadPhoto } from "@/util/uploadPhoto";
import { PutBlobResult } from "@vercel/blob";

interface Props {
    selectedCategory : Categories
    editCategoryOpen : boolean;
    setEditCategoryOpen : (value : boolean) => void;
}

const EditCategory = ({ selectedCategory , editCategoryOpen ,setEditCategoryOpen } : Props) => {
    const [ editedCategory , setEditedCategory ] = useState<Categories>(selectedCategory);
    const [ photoFile , setPhotoFile ] = useState<File>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(selectedCategory) {
            setEditedCategory(selectedCategory);
        }
    } , [selectedCategory])


    const handleUpdateCategory = async() => {
        dispatch(changeIsLoading(true));
        if(photoFile) {
            const blob = await uploadPhoto(photoFile) as PutBlobResult;
            dispatch(updateCategory({ ... editedCategory , iconUrl : blob.url , isSuccess : () => {
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({open : true , message : `Successfully updated from ${selectedCategory.name} to ${editedCategory.name}` , severity  : Severity.success}))
                setEditCategoryOpen(false);
                setEditedCategory(editedCategory);
                setPhotoFile(undefined);
            }}))
        } else {
            dispatch(updateCategory({ ... editedCategory , isSuccess : () => {
                dispatch(changeIsLoading(false));
                dispatch(openSnackBar({open : true , message : `Successfully updated from ${selectedCategory.name} to ${editedCategory.name}` , severity  : Severity.success}))
                setEditCategoryOpen(false);
                setEditedCategory(editedCategory);
            }}))
        }
    }

    return (
        <Dialog open={editCategoryOpen} onClose={() => {
            setEditCategoryOpen(false);
            setEditedCategory(selectedCategory);
            setPhotoFile(undefined);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}} >
                <Typography variant="h5" color="info" >Rename category</Typography>
                <TextField label={"Name"} defaultValue={selectedCategory.name} onChange={(event) => setEditedCategory({...editedCategory , name : event.target.value}) } />
                <Typography>( Optional )</Typography>
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px"}}
                >
                  Choose new Icon 
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        const files = event.target.files;
                        if(files) {
                           setPhotoFile(files[0]);
                        }
                        event.target.value = "";
                    }}
                  />
                </Button>
                <Box>
                    {photoFile && <Chip label={photoFile.name} variant="outlined" onDelete={() => setPhotoFile(undefined)} />}
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setEditCategoryOpen(false);
                        setEditedCategory(selectedCategory);
                        setPhotoFile(undefined);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!editedCategory.name} onClick={handleUpdateCategory} >Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default EditCategory;