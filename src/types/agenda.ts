import { IsFailOrSuccessType } from "./admin";

export interface NewAgendaItems extends IsFailOrSuccessType {
    agendaUrl : string;
}

export interface DeletedAgendaItems extends IsFailOrSuccessType {
    id : number;
}

export interface EditAgendaItems {
    open : boolean;
    agendaId : number;
}

export interface UpdatedAgendaItems extends IsFailOrSuccessType {
    id : number;
    agendaUrl : string;
}