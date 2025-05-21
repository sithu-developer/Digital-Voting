import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Categories } from "../../../generated/prisma";
import { DeletedCategoryItems, NewCategoryItems, UpdatedCategoryItems } from "@/types/categories";
import { envValues } from "@/util/envValues";
import { removeStudentsFromCategory } from "./studentsSlice";
import { removeVotes, setVotes } from "./votesSlice";
import { setIsTimeUp } from "./userSlice";

interface CategoriesInitialState {
    categories : Categories[],
    error : Error | null
}

const initialState : CategoriesInitialState = {
    categories : [],
    error : null,
}

export const createNewCategory = createAsyncThunk("categoriesSlice/createNewCategory" , async( newCategoryItems : NewCategoryItems , thunkApi) => {
    const { newCategory , iconUrl , isSuccess } = newCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ newCategory , iconUrl })
        });
        const { category } = await response.json();
        thunkApi.dispatch(addNewCategory(category))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const updateCategory = createAsyncThunk("categoriesSlice/updateCategory" , async( updatedCategoryItems : UpdatedCategoryItems , thunkApi) => {
    const { id , name , iconUrl , isShownResult , isSuccess } = updatedCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , iconUrl , isShownResult })
        });
        const { category } = await response.json();
        thunkApi.dispatch(replaceCategory(category))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const deleteCategory = createAsyncThunk("categoriesSlice/deleteCategory" , async( deletedCategoryItems : DeletedCategoryItems , thunkApi) => {
    const { categoryId , isSuccess } = deletedCategoryItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/categories?categoryId=${categoryId}` , {
            method : "DELETE",
        });
        const { deletedCategoryId , deletedVotes } = await response.json();
        thunkApi.dispatch(removeCategory(deletedCategoryId));
        thunkApi.dispatch(removeStudentsFromCategory(deletedCategoryId));
        thunkApi.dispatch(removeVotes(deletedVotes));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const checkFromResultPage = createAsyncThunk("categoriesSlice/checkFromResultPage" , async( _ , thunkApi ) => {
    try {
        const response = await fetch(`${envValues.apiUrl}/categories`);
        const {  categories , votes , isTimeUp  } = await response.json();
        thunkApi.dispatch(setIsTimeUp(isTimeUp))
        thunkApi.dispatch(setCategories(categories))
        thunkApi.dispatch(setVotes(votes))
    } catch(err) {
        console.log(err)
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