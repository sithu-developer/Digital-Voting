import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../../generated/prisma";
import { envValues } from "@/util/envValues";
import { NewAdminType } from "@/types/admin";

interface AdminSliceInitialState {
    admin : Admin | null,
    error : Error | null
}

export const createNewAdmin = createAsyncThunk("adminSlice/checkAdminPassword" , async( newAdmin : NewAdminType , thunkApi) => {
    const { password , email , isFail , isSuccess } = newAdmin;
    try {
        const response = await fetch(`${envValues.apiUrl}/admin` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ password , email })
        });
        const { newAdmin , err } = await response.json();
        if(newAdmin) {
            thunkApi.dispatch(setAdmin(newAdmin));
            isSuccess && isSuccess();
        } else {
            isFail && isFail(err);
        }
    } catch(err) {
        isFail && isFail(err);
    }
})

const initialState : AdminSliceInitialState = {
    admin : null,
    error : null,
}

const adminSlice = createSlice({
    name : "adminSlice",
    initialState ,
    reducers : {
       setAdmin : ( state , action : PayloadAction<Admin>) => {
            state.admin = action.payload
       }
    }
})

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;