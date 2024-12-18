import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import authService from "../Services/authService";
import usersService from "../Services/usersService";

const initialState={
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    currentUserSocket: null
}

export const getAllUsers= createAsyncThunk("/users/getAll", async(_, thunkAPI)=>{
    try {
        console.log("getAllUsers")
        //const token = thunkAPI.getState().auth.user.token
        const token =  sessionStorage.getItem("token")
        console.log("getAllUsers token:", token)
        return await usersService.getAllUsers(token)
    } 
    catch (error) {
        const msg = (error.response && error.response.data && error.response.data.message)||
                    error.message || error.toString()
        return thunkAPI.rejectWithValue({
            message: msg,
            status: error.response?.status_
        })
    }
})

export const getUserById= createAsyncThunk("/users/getById", async(id, thunkAPI)=>{
    try {
        console.log("getUserById")
        //const token = thunkAPI.getState().auth.user.token
        const token =  sessionStorage.getItem("token")
        console.log("getUserById token:", token)
        return await usersService.getUserById(id,token)
    } 
    catch (error) {
        const msg = (error.response && error.response.data && error.response.data.message)||
                    error.message || error.toString()
        return thunkAPI.rejectWithValue({
            message: msg,
            status: error.response?.status_
        })
    }
})

export const usersSlice = createSlice({
    name: "users",
    initialState,  // Fixed typo from initilState to initialState
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
        // Login action
        .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.users = action.payload.data;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.users = null;
        })
        .addCase(getUserById.pending, (state) => { state.isLoading = true; })
        .addCase(getUserById.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.currentUserSocket = action.payload.data;
        })
        .addCase(getUserById.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.users = null;
        })
    }
});

export const {reset} = usersSlice.actions
export default usersSlice.reducer;