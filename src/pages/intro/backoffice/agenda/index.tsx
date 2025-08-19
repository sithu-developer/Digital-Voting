import { Box, Button, Divider, IconButton, Typography } from "@mui/material"
import { useState } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteAgenda } from "@/store/slices/agendaSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import EditAgenda from "@/components/EditAgenda";
import { EditAgendaItems } from "@/types/agenda";
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { Agenda } from "../../../../../generated/prisma";
import Image from "next/image";
import NewAgenda from "@/components/NewAgenda";

const AgendaPage = () => {
    const agendas = useAppSelector(store => store.agendaSlice.agendas);
    const [ editAgendaItems , setEditAgendaItems ] = useState<EditAgendaItems>({open : false , agendaId : 0});
    const [ newAgendaOpen , setNewAgendaOpen ] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const handleDeleteAgenda = ( id : number) => {
      dispatch(changeIsLoading(true));
      dispatch(deleteAgenda({ id , isSuccess : () => {
        dispatch(changeIsLoading(false));
        dispatch(openSnackBar({ open : true , message : "Successfully Deleted" , severity : Severity.success}))
      } }))
    }

    const handleDownload = async( agenda : Agenda) => {
      try {
        const response = await fetch(agenda.agendaUrl, { mode: "cors" });
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `agenda${agenda.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl); 
      } catch (error) {
        console.error("Download failed:", error);
      }

      // const link = document.createElement("a");  // for local
      // link.href = agenda.agendaUrl;
      // link.download = `agenda${agenda.id}.jpg`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    };
    
    
    return (
        <Box  sx={{ display : "flex" , flexDirection : "column" , gap : "15px" , p : "10px"}} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Typography sx={{ ml : "30px"}} variant="h4" >Agenda</Typography>
                <Button variant="contained" onClick={() => setNewAgendaOpen(true)} >Create</Button>
            </Box>
            <Box sx={{ height : "calc(100vh - 180px)"  , overflowY : "auto" ,display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , borderRadius : "5px"}} >
              {agendas.map(item => (
                <Box  key={item.id} sx={{ width : "90%" , display : "flex" , flexDirection : "column" , gap : "3px"}} >
                  <Image alt="Agenda photo" src={item.agendaUrl} width={1000} height={1000} style={{ width : "100%" , height : "auto" , borderRadius : "5px"}} />
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
            <NewAgenda newAgendaOpen={newAgendaOpen} setNewAgendaOpen={setNewAgendaOpen} />
            <EditAgenda editAgendaItems={editAgendaItems} setEditAgendaItems={setEditAgendaItems} />
        </Box>
    )
}

export default AgendaPage;