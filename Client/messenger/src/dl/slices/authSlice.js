import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../Services/authService";

const initialState={
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const authLogin= createAsyncThunk("/auth/login", async(user, thunkAPI)=>{
    try {
        return await authService.login(user)
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

export const authRegister= createAsyncThunk("/auth/register", async(user, thunkAPI)=>{
    try {
        console.log("user:", user)
        return await authService.register(user)
    } 
    catch (error) {
        const msg = (error.response && error.response.data && error.response.data.message)||
                    error.message || error.toString()
        return thunkAPI.rejectWithValue({
            message: msg,
            status: error.response?.status
        })
    }
})

export const authLogOut= createAsyncThunk("/auth/logOut", ()=>{
     authService.logOut();   
})

export const authGetUser= createAsyncThunk("/user/get", ()=>{
    return user
})


export const authSlice = createSlice({
    name: "auth",
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
        .addCase(authLogin.pending, (state) => { state.isLoading = true; })
        .addCase(authLogin.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.user = action.payload.user;
        })
        .addCase(authLogin.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.user = null;
        })
        
        // Register action
        .addCase(authRegister.pending, (state) => { state.isLoading = true; })
        .addCase(authRegister.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message || 'Registration successful';
        })
        .addCase(authRegister.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })

        // Logout action
        .addCase(authLogOut.fulfilled, (state) => {
            state.user = null;
        });
    }
});
export const {reset} = authSlice.actions
export default authSlice.reducer;