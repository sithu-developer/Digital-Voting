import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Students } from "../../../generated/prisma";
import { DeletedStudentItems, NewStudentItems, UpdatedStudentItems } from "@/types/student";
import { envValues } from "@/util/envValues";
import { removeVotes } from "./votesSlice";

interface StudentsSliceInitialState {
    students : Students[],
    error : Error | null,
}

const initialState : StudentsSliceInitialState = {
    students : [],
    error : null,
}

export const createNewStudent  = createAsyncThunk("studentsSlice/createNewStudent" , async( newStudentItems : NewStudentItems , thunkApi ) => {
    const { contestantNumber , name , year , major , zodiacId , url , categoryId , isSuccess } = newStudentItems;
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
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
} )

export const updateStudent  = createAsyncThunk("studentsSlice/updateStudent" , async( updatedStudentItems : UpdatedStudentItems , thunkApi ) => {
    const { id , contestantNumber , name , year , major , zodiacId , url , isSuccess } = updatedStudentItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/student` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , contestantNumber , name , year , major , zodiacId , url  })
        });
        const { updatedStudent } = await response.json();
        thunkApi.dispatch(replaceStudent(updatedStudent));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
} )

export const deleteStudent = createAsyncThunk("categoriesSlice/deleteStudent" , async( deletedStudentItems : DeletedStudentItems , thunkApi) => {
    const { studentId , isSuccess } = deletedStudentItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/student?studentId=${studentId}` , {
            method : "DELETE",
        });
        const { deletedStudentId , deletedVotes } = await response.json();
        thunkApi.dispatch(removeStudent(deletedStudentId));
        thunkApi.dispatch(removeVotes(deletedVotes));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

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
        },
        replaceStudent : ( state , action : PayloadAction<Students>) => {
            state.students = state.students.map(item => item.id === action.payload.id ? action.payload : item );
        },
        removeStudent : ( state , action : PayloadAction<number>) => {
            state.students = state.students.filter(item => item.id !== action.payload)
        }
    }
})

export const { removeStudentsFromCategory , setStudents , addStudent , replaceStudent , removeStudent } = studentsSlice.actions;


export default studentsSlice.reducer;