import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Students } from "../../../generated/prisma";

interface StudentsSliceInitialState {
    students : Students[],
    error : Error | null,
}

const initialState : StudentsSliceInitialState = {
    students : [],
    error : null,
}

const studentsSlice = createSlice({
    name : "studentsSlice",
    initialState , 
    reducers : {
        removeStudentsFromCategory : ( state , action : PayloadAction<number>) => {
            state.students = state.students.filter(item => item.categoryId !== action.payload);
        },
        setStudents : ( state , action : PayloadAction<Students[]> ) => {
            state.students = action.payload;
        }
    }
})

export const { removeStudentsFromCategory , setStudents } = studentsSlice.actions;


export default studentsSlice.reducer;