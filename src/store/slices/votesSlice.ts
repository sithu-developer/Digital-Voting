import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Votes } from "../../../generated/prisma";

interface VotesSliceInitialState {
    votes : Votes[]
    error : Error | null,
}

const initialState : VotesSliceInitialState = {
    votes : [],
    error : null,
}

const votesSlice = createSlice({
    name : "votesSlice",
    initialState , 
    reducers : {
        removeVotesFromCategory : ( state , action : PayloadAction<Votes[]>) => {
            const deletedVoteIds = action.payload.map(item => item.id);
            state.votes = state.votes.filter(item => !deletedVoteIds.includes(item.id))
        },
        setVotes : (state , action : PayloadAction<Votes[]>) => {
            state.votes = action.payload;
        }
    }
})

export const { removeVotesFromCategory , setVotes } = votesSlice.actions;


export default votesSlice.reducer;