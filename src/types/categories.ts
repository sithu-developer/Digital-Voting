import { IsFailOrSuccessType } from "./admin";

export interface NewCategoryItems extends IsFailOrSuccessType {
    newCategory : string
}