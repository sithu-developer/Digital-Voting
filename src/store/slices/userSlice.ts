import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../generated/prisma";
import { NewUserType, UpdatedUserItems } from "@/types/user";
import { envValues } from "@/util/envValues";
import { setCategories } from "./categoriesSlice";
import { setStudents } from "./studentsSlice";
import { setAgendas } from "./agendaSlice";
import { setVotes } from "./votesSlice";

interface userInitialState {
    user : User | null,
    usersFromAdmin : User[]
    isTimeUp : boolean,
    error : Error | null
}

export const checkIsTimeUp = createAsyncThunk("userSlice/checkIsTimeUp" , async( _ , thunkApi ) => {
    try {
        const response = await fetch(`${envValues.apiUrl}/user`);
        const { isTimeUp } = await response.json();
        thunkApi.dispatch(setIsTimeUp(isTimeUp));
    } catch(err) {
        console.log(err)
    }
})

export const createNewUser = createAsyncThunk("userSlice/createNewUser" , async( newUser : NewUserType , thunkApi ) => {
    const { email , majorCode , isFail , isSuccess } = newUser;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email , majorCode })
        });
        const { newUser , categories , students , agendas , votes , isTimeUp , err } = await response.json();
        if(newUser) {
            thunkApi.dispatch(setUser(newUser));
            thunkApi.dispatch(setCategories(categories));
            thunkApi.dispatch(setStudents(students));
            thunkApi.dispatch(setAgendas(agendas));
            thunkApi.dispatch(setVotes(votes));
            thunkApi.dispatch(setIsTimeUp(isTimeUp));
            if(isSuccess) {
                isSuccess();
            }
        } else {
            if(isFail) {
                isFail(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
})

export const updateUser = createAsyncThunk("userSlice/updateUser" , async( updatedUserItems : UpdatedUserItems , thunkApi) => {
    const { id , name , isSubmitted , isSuccess } = updatedUserItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , isSubmitted })
        });
        const { updatedUser } = await response.json();
        thunkApi.dispatch(setUser(updatedUser))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }

})

const initialState : userInitialState = {
    user : null,
    usersFromAdmin : [],
    isTimeUp : false,
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
        },
        removeUsersFromMajor : ( state , action : PayloadAction<number>) => {
            state.usersFromAdmin = state.usersFromAdmin.filter(item => item.majorId !== action.payload)
        },
        setIsTimeUp : ( state , action : PayloadAction<boolean> ) => {
            state.isTimeUp = action.payload;
        }
    }
})

export const { setUser , setUsersFromAdmin , removeUsersFromMajor  , setIsTimeUp } = userSlice.actions;

export default userSlice.reducer;