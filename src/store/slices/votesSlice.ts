import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Votes } from "../../../generated/prisma";
import { RevotedStudentItems, VotedStudentItems } from "@/types/vote";
import { envValues } from "@/util/envValues";

interface VotesSliceInitialState {
    votes : Votes[]
    error : Error | null,
}

const initialState : VotesSliceInitialState = {
    votes : [],
    error : null,
}

export const voteStudent = createAsyncThunk("votesSlice/voteStudent" , async( voteStudentItems : VotedStudentItems , thunkApi ) => {
    const { studentId , userId , isSuccess } = voteStudentItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/vote` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ studentId , userId })
        });
        const { newVote } = await response.json();
        thunkApi.dispatch(addVote(newVote));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

export const revoteStudent = createAsyncThunk("votesSlice/revoteStudent" , async( revoteStudentItems : RevotedStudentItems , thunkApi ) => {
    const { id , studentId , isSuccess } = revoteStudentItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/vote` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , studentId })
        });
        const { updatedVote } = await response.json();
        thunkApi.dispatch(replaceVote(updatedVote));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

const votesSlice = createSlice({
    name : "votesSlice",
    initialState , 
    reducers : {
        removeVotes : ( state , action : PayloadAction<Votes[]>) => {
            const deletedVoteIds = action.payload.map(item => item.id);
            state.votes = state.votes.filter(item => !deletedVoteIds.includes(item.id))
        },
        setVotes : (state , action : PayloadAction<Votes[]>) => {
            state.votes = action.payload;
        },
        addVote : (state , action : PayloadAction<Votes>) => {
            state.votes = [...state.votes , action.payload ];
        },
        replaceVote : (state , action : PayloadAction<Votes> ) => {
            state.votes = state.votes.map(item => item.id === action.payload.id ? action.payload : item);
        },
        filterRelatedVotes : ( state , action : PayloadAction<number> ) => {
            state.votes = state.votes.filter(item => item.userId === action.payload);
        }
    }
})

export const { removeVotes , setVotes , addVote , replaceVote , filterRelatedVotes } = votesSlice.actions;


export default votesSlice.reducer;