import { Box, Dialog, IconButton, Typography } from "@mui/material"
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useAppSelector } from "@/store/hooks";

interface Props {
    agendaOpen : boolean;
    setAgendaOpen : (value : boolean) => void;
}

const Agenda = ({ agendaOpen , setAgendaOpen } : Props) => {
    const agendas = useAppSelector(store => store.agendaSlice.agendas);

    return (
        <Dialog fullScreen open={agendaOpen} onClose={() => setAgendaOpen(false)}>
            <Box sx={{ bgcolor : "#1B1D84" , display : "flex" , alignItems : "center" , gap : "15px" , p : "10px 10px"}}>
                <IconButton onClick={() => setAgendaOpen(false)} >
                    <ArrowBackRoundedIcon sx={{ color : "lightgray" , fontSize : "30px"}} />
                </IconButton>
                <Typography variant="h5">Agenda</Typography>
            </Box>
            <Box sx={{ bgcolor : "info.main" , height : "calc(100vh - 66px)" , overflowY : "auto"}} >
                {agendas.map(item => (
                    <img key={item.id} alt="agenda photo" src={item.agendaUrl} style={{ width : "100%"}} />
                ))}
            </Box>
        </Dialog>
    )
}

export default Agenda;