import { Backdrop, Box, CircularProgress } from "@mui/material";

interface Props {
    loadingOpen : boolean;
}

const Loading = ( { loadingOpen } : Props ) => {
    return (
    <Box>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loadingOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
    )
}

export default Loading;