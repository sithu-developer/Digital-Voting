import { IsFailOrSuccessType } from "./admin";

export interface NewUserType extends IsFailOrSuccessType {
    majorCode : string,
    email : string,
}