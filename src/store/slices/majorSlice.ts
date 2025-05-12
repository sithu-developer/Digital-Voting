import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Major } from "../../../generated/prisma";

interface MajorsSliceInitialState {
    majors : Major[]
    error : Error | null,
}

const initialState : MajorsSliceInitialState = {
    majors : [],
    error : null,
}

const majorSlice = createSlice({
    name : "majorSlice",
    initialState , 
    reducers : {
        setMajors : (state , action : PayloadAction<Major[]>) => {
            state.majors = action.payload;
        }
    }
})

export const { setMajors } = majorSlice.actions;


export default majorSlice.reducer;