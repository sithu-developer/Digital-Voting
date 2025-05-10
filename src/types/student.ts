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