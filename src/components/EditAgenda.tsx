import { useAppDispatch } from "@/store/hooks";
import { updateAgenda } from "@/store/slices/agendaSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { EditAgendaItems } from "@/types/agenda";
import { Severity } from "@/types/snackBar";
import { Box, Button, Chip, Dialog, DialogContent, Typography } from "@mui/material"
import { useState } from "react";

interface Props {
    editAgendaItems : EditAgendaItems;
    setEditAgendaItems : ( value : EditAgendaItems) => void
}

const EditAgenda = ({ editAgendaItems , setEditAgendaItems } : Props) => {
    const [ photoFile , setPhotoFile ] = useState<File>();
    const dispatch = useAppDispatch();

    const handleUpdateAgenda = () => {
        // here to upload photo to database
        dispatch(updateAgenda({ id : editAgendaItems.agendaId , agendaUrl : "/selectionBackground2.jpg" , isSuccess : () => {
            setPhotoFile(undefined)
            setEditAgendaItems({ open : false , agendaId : 0});
            dispatch(openSnackBar({ open : true , message : "Successfully changed Agenda photo" , severity : Severity.success }))
        }}))
    } 

    return (
        <Dialog open={editAgendaItems.open} onClose={() => {
            setPhotoFile(undefined)
            setEditAgendaItems({ open : false , agendaId : 0});
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "15px"}} >
                <Typography>Change Agenda Photo</Typography>
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px" , textTransform : "none"}}
                >
                  Choose Agenda Photo to Change
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
                        setPhotoFile(undefined);
                        setEditAgendaItems({open : false , agendaId : 0})
                    }} >Cancel</Button>
                    <Button variant="contained" disabled={!photoFile} onClick={handleUpdateAgenda} >Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default EditAgenda;