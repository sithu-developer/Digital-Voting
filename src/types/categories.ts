import { Categories } from "../../generated/prisma";
import { IsFailOrSuccessType } from "./admin";

export interface NewCategoryItems extends IsFailOrSuccessType {
    newCategory : string
    iconUrl : string
}

export interface UpdatedCategoryItems extends Categories , IsFailOrSuccessType {}

export interface DeletedCategoryItems extends IsFailOrSuccessType {
    categoryId : number;
}