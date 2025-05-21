import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Agenda } from "../../../generated/prisma";
import { DeletedAgendaItems, NewAgendaItems, UpdatedAgendaItems } from "@/types/agenda";
import { envValues } from "@/util/envValues";

interface AgendaInitialState {
    agendas : Agenda[],
    error : Error | null
}

const initialState : AgendaInitialState = {
    agendas : [],
    error : null,
}

export const createAgenda = createAsyncThunk("agendaSlice/createAgenda" , async( newAgendaItems : NewAgendaItems  , thunkApi ) => {
    const { agendaUrl , isSuccess } = newAgendaItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/agenda` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ agendaUrl })
        });
        const { newAgenda } = await response.json();
        thunkApi.dispatch(addAgenda(newAgenda));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

export const updateAgenda = createAsyncThunk("agendaSlice/updateAgenda" , async( updatedAgendaItems : UpdatedAgendaItems  , thunkApi ) => {
    const { id , agendaUrl , isSuccess } = updatedAgendaItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/agenda` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , agendaUrl })
        });
        const { updatedAgenda } = await response.json();
        thunkApi.dispatch(replaceAgenda(updatedAgenda));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

export const deleteAgenda = createAsyncThunk("agendaSlice/deleteAgenda" , async( deletedAgendaItems : DeletedAgendaItems  , thunkApi ) => {
    const { id , isSuccess } = deletedAgendaItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/agenda?id=${id}` , {
            method : "DELETE"
        });
        const { deletedAgendaId } = await response.json();
        thunkApi.dispatch(removeAgenda(deletedAgendaId));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

const agendaSlice = createSlice({
    name : "agendaSlice",
    initialState ,
    reducers : {
        setAgendas : ( state , action : PayloadAction<Agenda[]> ) => {
            state.agendas = action.payload;
        },
        addAgenda : ( state , action : PayloadAction<Agenda>) => {
            state.agendas = [...state.agendas , action.payload ]
        },
        removeAgenda : ( state , action : PayloadAction<number>) => {
            state.agendas = state.agendas.filter(item => item.id !== action.payload);
        },
        replaceAgenda : ( state , action : PayloadAction<Agenda>) => {
            state.agendas = state.agendas.map(item => item.id === action.payload.id ? action.payload : item);
        }
    }
})

export const { setAgendas , addAgenda , removeAgenda , replaceAgenda } = agendaSlice.actions;

export default agendaSlice.reducer;