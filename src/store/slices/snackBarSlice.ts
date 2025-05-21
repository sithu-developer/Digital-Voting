import { Severity, SnackBarItem } from "@/types/snackBar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SnackBarInitialState {
    item : SnackBarItem
}

const item : SnackBarItem = {
    open : false,
    severity : Severity.success,
    message : ""
}

const initialState : SnackBarInitialState = {
    item
}

const snackBarSlice = createSlice({
    name : "snackBarSlice",
    initialState , 
    reducers : {
        openSnackBar : ( state , action : PayloadAction<SnackBarItem>) => {
            state.item = {...action.payload};
        }
    }
})

export const { openSnackBar } = snackBarSlice.actions;


export default snackBarSlice.reducer;