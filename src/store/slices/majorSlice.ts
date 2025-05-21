import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Major } from "../../../generated/prisma";
import { DeletedMajorItems, NewMajorItems, UpdatedMajorItems } from "@/types/major";
import { envValues } from "@/util/envValues";
import { removeVotes } from "./votesSlice";
import { removeUsersFromMajor } from "./userSlice";

interface MajorsSliceInitialState {
    majors : Major[]
    error : Error | null,
}

const initialState : MajorsSliceInitialState = {
    majors : [],
    error : null,
}

export const changeAdminCodeAndLimit = createAsyncThunk( "majorSlice/changeAdminCodeAndLimit" , async( changedAdminInMajor : UpdatedMajorItems , thunkApi ) => {
    const { id , majorsOrAdmin , maxQuantity , passCode , isTimeUp , isSuccess } = changedAdminInMajor;
    try {
        const response = await fetch(`${envValues.apiUrl}/major` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , majorsOrAdmin , maxQuantity , passCode , isTimeUp })
        });
        const { updatedAdminInMajor } = await response.json();
        thunkApi.dispatch(replaceMajor(updatedAdminInMajor));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const createMajor = createAsyncThunk( "majorSlice/createMajor" , async( newMajor : NewMajorItems , thunkApi ) => {
    const { majorName , majorCode , quantity , isSuccess } = newMajor;
    try {
        const response = await fetch(`${envValues.apiUrl}/major` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ majorName , majorCode , quantity })
        });
        const { newMajor } = await response.json();
        thunkApi.dispatch(addMajor(newMajor));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const updateMajor = createAsyncThunk( "majorSlice/updateMajor" , async( updatedMajor : UpdatedMajorItems , thunkApi ) => {
    const { id , majorsOrAdmin , maxQuantity , passCode , isTimeUp , isSuccess } = updatedMajor;
    try {
        const response = await fetch(`${envValues.apiUrl}/major` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , majorsOrAdmin , maxQuantity , passCode , isTimeUp })
        });
        const { updatedMajor } = await response.json();
        thunkApi.dispatch(replaceMajor(updatedMajor));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const deleteMajor = createAsyncThunk( "majorSlice/deleteMajor" , async( deletedMajor : DeletedMajorItems , thunkApi ) => {
    const { majorId , isSuccess } = deletedMajor;
    try {
        const response = await fetch(`${envValues.apiUrl}/major?majorId=${majorId}` , {
            method : "DELETE"
        });
        const { deletedMajorId , deletedVotes } = await response.json();
        thunkApi.dispatch(removeVotes(deletedVotes));
        thunkApi.dispatch(removeUsersFromMajor(deletedMajorId));
        thunkApi.dispatch(removeMajor(deletedMajorId));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const majorSlice = createSlice({
    name : "majorSlice",
    initialState , 
    reducers : {
        setMajors : (state , action : PayloadAction<Major[]>) => {
            state.majors = action.payload;
        },
        replaceMajor : (state , action : PayloadAction<Major>) => {
            state.majors = state.majors.map(item => item.id === action.payload.id ? action.payload : item)
        },
        addMajor : (state , action : PayloadAction<Major>) => {
            state.majors = [...state.majors , action.payload ]
        },
        removeMajor : (state , action : PayloadAction<number>) => {
            state.majors = state.majors.filter(item => item.id !== action.payload)
        }
    }
})

export const { setMajors , replaceMajor , addMajor , removeMajor } = majorSlice.actions;


export default majorSlice.reducer;