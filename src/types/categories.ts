import { Categories } from "../../generated/prisma";
import { IsFailOrSuccessType } from "./admin";

export interface NewCategoryItems extends IsFailOrSuccessType {
    newCategory : string
}

export interface UpdatedCategoryItems extends IsFailOrSuccessType {
    updatedCategory : Categories
}

export interface DeletedCategoryItems extends IsFailOrSuccessType {
    categoryId : number;
}