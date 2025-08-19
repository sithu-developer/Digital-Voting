import { Severity, SnackBarItem } from "@/types/snackBar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SnackBarInitialState {
    item : SnackBarItem
    isLoading : boolean,
}

const item : SnackBarItem = {
    open : false,
    severity : Severity.success,
    message : ""
}

const initialState : SnackBarInitialState = {
    item ,
    isLoading : false
}

const snackBarSlice = createSlice({
    name : "snackBarSlice",
    initialState , 
    reducers : {
        openSnackBar : ( state , action : PayloadAction<SnackBarItem>) => {
            state.item = {...action.payload};
        },
        changeIsLoading : ( state , action : PayloadAction<boolean> ) => {
            state.isLoading = action.payload;
        }
    }
})

export const { openSnackBar , changeIsLoading } = snackBarSlice.actions;


export default snackBarSlice.reducer;