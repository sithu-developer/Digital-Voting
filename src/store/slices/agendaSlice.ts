import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Agenda } from "../../../generated/prisma";

interface AgendaInitialState {
    agendas : Agenda[],
    error : Error | null
}

const initialState : AgendaInitialState = {
    agendas : [],
    error : null,
}


const agendaSlice = createSlice({
    name : "agendaSlice",
    initialState ,
    reducers : {
        setAgendas : ( state , action : PayloadAction<Agenda[]> ) => {
            state.agendas = action.payload;
        },

    }
})

export const { setAgendas  } = agendaSlice.actions;

export default agendaSlice.reducer;