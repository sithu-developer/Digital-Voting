import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../../generated/prisma";
import { envValues } from "@/util/envValues";
import { NewAdminType } from "@/types/admin";
import { setCategories } from "./categoriesSlice";
import { setStudents } from "./studentsSlice";
import { setVotes } from "./votesSlice";
import { setUsersFromAdmin } from "./userSlice";
import { setMajors } from "./majorSlice";
import { setAgendas } from "./agendaSlice";

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
        const { newAdmin , categories , students , votes , users , majors , agendas , err } = await response.json();
        if(newAdmin) {
            thunkApi.dispatch(setAdmin(newAdmin));
            thunkApi.dispatch(setCategories(categories));
            thunkApi.dispatch(setStudents(students));
            thunkApi.dispatch(setVotes(votes));
            thunkApi.dispatch(setUsersFromAdmin(users))
            thunkApi.dispatch(setMajors(majors))
            thunkApi.dispatch(setAgendas(agendas))
            if(isSuccess) {
                isSuccess();
            }
        } else {
            if(isFail) {
                isFail(err);
            } 
        }
    } catch(err) {
        console.log(err)
    }
})

export const checkUsersAndVotes = createAsyncThunk("adminSlice/checkUsersAndVotes" , async( _ , thunkApi ) => {
    try {
        const response = await fetch(`${envValues.apiUrl}/admin`);
        const { users , votes } = await response.json();
        thunkApi.dispatch(setVotes(votes));
        thunkApi.dispatch(setUsersFromAdmin(users))
    } catch(err) {
        console.log(err)
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