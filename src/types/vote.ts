import { IsFailOrSuccessType } from "./admin";

export interface VotedStudentItems extends IsFailOrSuccessType {
    userId : number;
    studentId : number;
}

export interface RevotedStudentItems extends IsFailOrSuccessType {
    id : number;
    studentId : number;
}