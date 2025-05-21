import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Alert, Snackbar } from "@mui/material"

const SnackBarComp = () => {
    const snackBar = useAppSelector(store => store.snackBar.item);

    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(openSnackBar({...snackBar , open : false , message : ""}))
    }

    return (
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={snackBar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackBar.message}
          </Alert>
        </Snackbar>
    )
}

export default SnackBarComp;