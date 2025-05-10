import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Students } from "../../../generated/prisma";
import { NewStudentItems } from "@/types/student";
import { envValues } from "@/util/envValues";

interface StudentsSliceInitialState {
    students : Students[],
    error : Error | null,
}

const initialState : StudentsSliceInitialState = {
    students : [],
    error : null,
}

export const createNewStudent  = createAsyncThunk("studentsSlice/createNewStudent" , async( newStudentItems : NewStudentItems , thunkApi ) => {
    const { contestantNumber , name , year , major , zodiacId , url , categoryId , isFail , isSuccess } = newStudentItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/student` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ contestantNumber , name , year , major , zodiacId , url , categoryId })
        });
        const { newStudent } = await response.json();
        thunkApi.dispatch(addStudent(newStudent));
        isSuccess && isSuccess();
    } catch(err) {
        console.log(err)
    }
} )

const studentsSlice = createSlice({
    name : "studentsSlice",
    initialState , 
    reducers : {
        removeStudentsFromCategory : ( state , action : PayloadAction<number>) => {
            state.students = state.students.filter(item => item.categoryId !== action.payload);
        },
        setStudents : ( state , action : PayloadAction<Students[]> ) => {
            state.students = action.payload;
        },
        addStudent : ( state , action : PayloadAction<Students>) => {
            state.students = [...state.students , action.payload ]
        }
    }
})

export const { removeStudentsFromCategory , setStudents , addStudent } = studentsSlice.actions;


export default studentsSlice.reducer;