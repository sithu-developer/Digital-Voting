import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../generated/prisma";

interface userInitialState {
    users : User[],
    error : Error | null
}

const initialState : userInitialState = {
    users : [],
    error : null,
}

const userSlice = createSlice({
    name : "userSlice",
    initialState ,
    reducers : {}
})

export default userSlice.reducer;