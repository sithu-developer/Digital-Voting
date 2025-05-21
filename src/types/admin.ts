export interface AdminPasswordItemsType {
    open : boolean,
    password : string
}

export interface IsFailOrSuccessType {
    isFail ?: (value ?: unknown ) => void;
    isSuccess ?: (value ?: unknown ) => void;
}

export interface NewAdminType extends IsFailOrSuccessType {
    email : string,
    password : string,
}
