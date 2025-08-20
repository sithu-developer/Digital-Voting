import { useAppDispatch } from "@/store/hooks";
import { createAgenda } from "@/store/slices/agendaSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { uploadPhoto } from "@/util/uploadPhoto";
import { Box, Button, Chip, Dialog, DialogContent, Typography } from "@mui/material"
import { PutBlobResult } from "@vercel/blob";
import { useState } from "react";

interface Props {
    newAgendaOpen : boolean;
    setNewAgendaOpen : ( value : boolean ) => void;
}

const NewAgenda = ( { newAgendaOpen , setNewAgendaOpen } : Props ) => {
    const [ photoFile , setPhotoFile ] = useState<File>();
    const dispatch = useAppDispatch();
    
    
    const handleCreateAgenda = async() => {
        if(photoFile) {
            dispatch(changeIsLoading(true));
            const blob = await uploadPhoto(photoFile) as PutBlobResult;
            dispatch(createAgenda({ agendaUrl : blob.url , isSuccess : () => {
              setPhotoFile(undefined);
              setNewAgendaOpen(false);
              dispatch(changeIsLoading(false));
              dispatch(openSnackBar({ open : true , message : "Successfully added new Agenda Photo" , severity : Severity.success}))
            }}));
        }
    }

    return (
        <Dialog open={newAgendaOpen} onClose={() => {
            setPhotoFile(undefined);
            setNewAgendaOpen(false);
        }}  >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px" , minWidth : "300px"}} >
                <Typography variant="h5" >New Agenda</Typography>
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px" , textTransform : "none"}}
                >
                  Add New Agenda Photo
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
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}}>
                    <Button variant="contained" onClick={() => {
                        setPhotoFile(undefined);
                        setNewAgendaOpen(false);
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!photoFile} onClick={handleCreateAgenda} >Create</Button>
                </Box>
            </DialogContent>

        </Dialog>
    )
}

export default NewAgenda;