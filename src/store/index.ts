import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/store/slices/userSlice";
import adminReducer from "@/store/slices/adminSlice";
import snackBarReducer from "@/store/slices/snackBarSlice"
import categoriesReducer from "@/store/slices/categoriesSlice"
import studentsReducer from "@/store/slices/studentsSlice"
import votesReducer from "@/store/slices/votesSlice"
import majorsReducer from "@/store/slices/majorSlice"
import agendaReducer from "@/store/slices/agendaSlice"

export const store = configureStore({
  reducer: {
    userSlice : userReducer,
    adminSlice : adminReducer,
    snackBar : snackBarReducer,
    categoriesSlice : categoriesReducer,
    studentsSlice : studentsReducer,
    votesSlice : votesReducer,
    majorsSlice : majorsReducer,
    agendaSlice : agendaReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch