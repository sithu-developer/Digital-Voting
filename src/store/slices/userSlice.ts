import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../generated/prisma";
import { NewUserType } from "@/types/user";
import { envValues } from "@/util/envValues";

interface userInitialState {
    user : User | null,
    usersFromAdmin : User[]
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
    usersFromAdmin : [],
    error : null,
}

const userSlice = createSlice({
    name : "userSlice",
    initialState ,
    reducers : {
        setUser : ( state , action : PayloadAction<User>) => {
            state.user = action.payload;
        },
        setUsersFromAdmin : ( state , action : PayloadAction<User[]>) => {
            state.usersFromAdmin = action.payload;
        }
    }
})

export const { setUser , setUsersFromAdmin } = userSlice.actions;

export default userSlice.reducer;