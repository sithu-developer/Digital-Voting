import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../generated/prisma";
import { NewUserType } from "@/types/user";
import { envValues } from "@/util/envValues";

interface userInitialState {
    user : User | null,
    error : Error | null
}

export const createNewUser = createAsyncThunk("userSlice" , async( newUser : NewUserType , thunkApi ) => {
    const { email , majorCode , isFail , isSuccess } = newUser;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email , majorCode })
        });
        const { newUser , err } = await response.json();
        if(newUser) {
            thunkApi.dispatch(setUser(newUser));
            isSuccess && isSuccess();
        } else {
            isFail && isFail(err);
        }
    } catch (err) {
        isFail && isFail(err);
    }
})

const initialState : userInitialState = {
    user : null,
    error : null,
}

const userSlice = createSlice({
    name : "userSlice",
    initialState ,
    reducers : {
        setUser : ( state , action : PayloadAction<User>) => {
            state.user = action.payload;
        }
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;