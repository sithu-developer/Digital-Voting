import { Major } from "../../generated/prisma";
import { IsFailOrSuccessType } from "./admin";

export interface AdminFromTyping {
    oldAdminCodeFromTyping : string,
    newAdminCodeFromTyping : string,
    newLimit : number
}

export interface UpdatedMajorItems extends Major , IsFailOrSuccessType {}

export interface NewMajorItems extends IsFailOrSuccessType {
    majorName : string,
    majorCode : string,
    quantity : number
}

export interface DeletedMajorItems extends IsFailOrSuccessType {
    majorId : number
}
