import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/store/slices/userSlice";
import adminReducer from "@/store/slices/adminSlice";
import snackBarReducer from "@/store/slices/snackBarSlice"
import categoriesReducer from "@/store/slices/categoriesSlice"

export const store = configureStore({
  reducer: {
    userSlice : userReducer,
    adminSlice : adminReducer,
    snackBar : snackBarReducer,
    categoriesSlice : categoriesReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch