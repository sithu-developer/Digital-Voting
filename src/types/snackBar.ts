export enum Severity {
    success = "success",
    error = "error" ,
    info = "info",
    warning = "warning"
}

export interface SnackBarItem {
    open : boolean,
    message : string,
    severity : Severity
}