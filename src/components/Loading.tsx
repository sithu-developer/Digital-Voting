import { useAppSelector } from "@/store/hooks";
import { Backdrop, Box, CircularProgress } from "@mui/material";


const Loading = () => {
    const isLoading = useAppSelector(store => store.snackBar.isLoading);

    return (
    <Box>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.tooltip + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
    )
}

export default Loading;