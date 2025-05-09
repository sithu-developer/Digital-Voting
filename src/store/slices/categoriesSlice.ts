import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Categories } from "../../../generated/prisma";
import { DeletedCategoryItems, NewCategoryItems, UpdatedCategoryItems } from "@/types/categories";
import { envValues } from "@/util/envValues";
import { removeStudentsFromCategory } from "./studentsSlice";
import { removeVotesFromCategory } from "./votesSlice";

interface CategoriesInitialState {
    categories : Categories[],
    error : Error | null
}

const initialState : CategoriesInitialState = {
    categories : [],
    error : null,
}

export const createNewCategory = createAsyncThunk("categoriesSlice/createNewCategory" , async( newCategoryItems : NewCategoryItems , thunkApi) => {
    const { newCategory , isFail , isSuccess } = newCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ newCategory })
        });
        const { category } = await response.json();
        thunkApi.dispatch(addNewCategory(category))
        isSuccess && isSuccess();
    } catch(err) {
        isFail && isFail();
    }
})

export const updateCategory = createAsyncThunk("categoriesSlice/updateCategory" , async( updatedCategoryItems : UpdatedCategoryItems , thunkApi) => {
    const { updatedCategory , isFail , isSuccess } = updatedCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ updatedCategory })
        });
        const { category } = await response.json();
        thunkApi.dispatch(replaceCategory(category))
        isSuccess && isSuccess();
    } catch(err) {
        isFail && isFail();
    }
})

export const deleteCategory = createAsyncThunk("categoriesSlice/deleteCategory" , async( deletedCategoryItems : DeletedCategoryItems , thunkApi) => {
    const { categoryId , isFail , isSuccess } = deletedCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories?categoryId=${categoryId}` , {
            method : "DELETE",
        });
        const { deletedCategoryId , deletedVotes } = await response.json();
        thunkApi.dispatch(removeCategory(deletedCategoryId));
        thunkApi.dispatch(removeStudentsFromCategory(deletedCategoryId));
        thunkApi.dispatch(removeVotesFromCategory(deletedVotes));
        isSuccess && isSuccess();
    } catch(err) {
        isFail && isFail();
    }
})


const categoriesSlice = createSlice({
    name : "categoriesSlice",
    initialState ,
    reducers : {
        addNewCategory : ( state , action : PayloadAction<Categories> ) => {
            state.categories = [...state.categories , action.payload];
        },
        setCategories : ( state , action : PayloadAction<Categories[]> ) => {
            state.categories = action.payload;
        },
        replaceCategory : ( state , action : PayloadAction<Categories> ) => {
            state.categories = state.categories.map(item => item.id === action.payload.id ? action.payload : item );
        },
        removeCategory : (state , action : PayloadAction<number>) => {
            state.categories = state.categories.filter(item => item.id !== action.payload);
        }

    }
})

export const { addNewCategory , replaceCategory , setCategories , removeCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;