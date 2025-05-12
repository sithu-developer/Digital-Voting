import { Box, Button, Chip, Typography } from "@mui/material"
import { useState } from "react";

const AgendaPage = () => {
        const [ photoFile , setPhotoFile ] = useState<File>();
    
    return (
        <Box  sx={{ display : "flex" , flexDirection : "column" , gap : "5px" , p : "10px"}} >
            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Box>
                    {photoFile && <Chip label={photoFile.name} variant="outlined" onDelete={() => setPhotoFile(undefined)} />}
                </Box>
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px"}}
                >
                  Choose Agenda Photo
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
            </Box>
            <Typography sx={{ textAlign : "center"}} variant="h4" >Agenda</Typography>
        </Box>
    )
}

export default AgendaPage;