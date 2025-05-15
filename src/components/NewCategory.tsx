import { useAppDispatch } from "@/store/hooks";
import { createNewCategory } from "@/store/slices/categoriesSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { Box, Button, Chip, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { useState } from "react";

interface Props {
    newCategoryOpen : boolean;
    setNewCategoryOpen : (value : boolean) => void;
}

const NewCategory = ({ newCategoryOpen , setNewCategoryOpen } : Props) => {
    const [ newCategory , setNewCategory ] = useState<string>("");
    const [ photoFile , setPhotoFile ] = useState<File>();
    const dispatch = useAppDispatch();

    const handleCreateNewCategory = () => {
        // here to upload photo to database
        dispatch(createNewCategory({newCategory , iconUrl : "/kingIcon.svg"/* here to change */ , isSuccess : () => {
            setNewCategoryOpen(false);
            setNewCategory("");
            setPhotoFile(undefined);
            dispatch(openSnackBar({open : true , message : "New Category is successfully created" , severity : Severity.success}))
        }}));
    }

    return (
        <Dialog open={newCategoryOpen} onClose={() => {
            setNewCategoryOpen(false);
            setNewCategory("");
            setPhotoFile(undefined);
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px"}} >
                <Typography variant="h5" color="info" >New Category</Typography>
                <TextField label="Name" onChange={(event) => setNewCategory(event.target.value)} />
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px"}}
                >
                  Choose Icon Photo
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        const files = event.target.files;
                        if(files) {
                           setPhotoFile(files[0]);
                        }
                    }}
                  />
                </Button>
                <Box>
                    {photoFile && <Chip label={photoFile.name} variant="outlined" onDelete={() => setPhotoFile(undefined)} />}
                </Box>
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setNewCategoryOpen(false);
                        setNewCategory("");
                        setPhotoFile(undefined);
                    }} >cancel</Button>
                    <Button variant="contained" disabled={!newCategory || !photoFile} onClick={handleCreateNewCategory} >Create</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewCategory;