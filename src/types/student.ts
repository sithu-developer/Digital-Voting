import { Students } from "../../generated/prisma";
import { IsFailOrSuccessType } from "./admin";

export interface NewStudentItems extends IsFailOrSuccessType {
    name : string,
    year : number,
    major : string,
    zodiacId : number,
    url : string,
    contestantNumber : number,
    categoryId : number,
}

export interface UpdatedStudentItems extends Students , IsFailOrSuccessType {}

export interface DeletedStudentItems extends IsFailOrSuccessType {
    studentId : number
}