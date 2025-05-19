import { IsFailOrSuccessType } from "./admin";

export interface NewUserType extends IsFailOrSuccessType {
    majorCode : string,
    email : string,
}

export interface UpdatedUserItems extends IsFailOrSuccessType {
    id : number;
    name : string;
    isSubmitted : boolean;
}