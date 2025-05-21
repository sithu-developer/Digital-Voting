import { Box, Button, Divider, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAgenda, deleteAgenda } from "@/store/slices/agendaSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import EditAgenda from "@/components/EditAgenda";
import { EditAgendaItems } from "@/types/agenda";
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { Agenda } from "../../../../../generated/prisma";

const AgendaPage = () => {
    const agendas = useAppSelector(store => store.agendaSlice.agendas);
    const [ photoFile , setPhotoFile ] = useState<File>();
    const [ editAgendaItems , setEditAgendaItems ] = useState<EditAgendaItems>({open : false , agendaId : 0});
    const dispatch = useAppDispatch();
    
    useEffect(() => {
      if(photoFile) {
        // here to upload photo to database
        dispatch(createAgenda({ agendaUrl : "/selectionBackground.jpg" , isSuccess : () => {
          setPhotoFile(undefined)
          dispatch(openSnackBar({ open : true , message : "Successfully added new Agenda Photo" , severity : Severity.success}))
        }}))
      }
    } , [photoFile]);

    const handleDeleteAgenda = ( id : number) => {
      dispatch(deleteAgenda({ id , isSuccess : () => {
        dispatch(openSnackBar({ open : true , message : "Successfully Deleted" , severity : Severity.success}))
      } }))
    }

      const handleDownload = ( agenda : Agenda) => {
        const link = document.createElement("a");
        link.href = agenda.agendaUrl;
        link.download = `agenda${agenda.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
    
    return (
        <Box  sx={{ display : "flex" , flexDirection : "column" , gap : "15px" , p : "10px"}} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Typography sx={{ textAlign : "center" , flexGrow : 1}} variant="h4" >Agenda</Typography>
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
            </Box>
            <Box sx={{ height : "calc(100vh - 180px)"  , overflowY : "auto" ,display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , borderRadius : "5px"}} >
              {agendas.map(item => (
                <Box  key={item.id} sx={{ width : "90%" , display : "flex" , flexDirection : "column" , gap : "3px"}} >
                  <img alt="Agenda photo" src={item.agendaUrl} style={{ width : "100%" , borderRadius : "5px"}} />
                  <Box sx={{ display : "flex" , justifyContent : "end" , gap : "5px"}}>
                    <IconButton onClick={() => handleDownload(item)}>
                      <FileDownloadRoundedIcon sx={{ color : "black"}} />
                    </IconButton>
                    <IconButton onClick={() => setEditAgendaItems({open : true , agendaId : item.id})} >
                      <EditRoundedIcon sx={{ color : "black"}} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAgenda(item.id) }>
                      <DeleteOutlineRoundedIcon color="error" />
                    </IconButton>
                  </Box>
                  <Divider variant="middle" sx={{ bgcolor : "black"}} />
                </Box>
              ))}
            </Box>
            <EditAgenda editAgendaItems={editAgendaItems} setEditAgendaItems={setEditAgendaItems} />
        </Box>
    )
}

export default AgendaPage;