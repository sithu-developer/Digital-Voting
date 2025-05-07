export interface AdminPasswordItemsType {
    open : boolean,
    password : string
}

export interface IsFailOrSuccessType {
    isFail ?: (value ?: any ) => void;
    isSuccess ?: (value ?: any) => void;
}

export interface NewAdminType extends IsFailOrSuccessType {
    email : string,
    password : string,
}