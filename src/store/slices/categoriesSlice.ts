import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Categories } from "../../../generated/prisma";
import { NewCategoryItems } from "@/types/categories";
import { envValues } from "@/util/envValues";

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

const categoriesSlice = createSlice({
    name : "categoriesSlice",
    initialState ,
    reducers : {
        addNewCategory : ( state , action : PayloadAction<Categories> ) => {
            state.categories = [...state.categories , action.payload];
        }
    }
})

export const { addNewCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;