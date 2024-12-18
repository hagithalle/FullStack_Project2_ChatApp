import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blockedUserService from "../Services/blockedUserService";

const initialState = {
    blockedUsers: [],  // Array of blocked users
    blockedUsersById: [],
    isSuccess: false,
    isError: false,
    message: ""
};

export const getAllBlockedUser= createAsyncThunk("/blockedUser/getAllBlockedUser", async(_, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")     
        return await blockedUserService.fetchBlockedUsers(token)
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


export const getAllBlockedUserById= createAsyncThunk("/blockedUser/getAllBlockedUserById", async(userId, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        if(userId)
        {
            console.log("/blockedUser/getAllBlockedUser", token, userId)
        }
        else{
            console.log("userId empty")
        }
       
        return await blockedUserService.fetchBlockedUsersById(userId, token)
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

export const blockedUser= createAsyncThunk("/blockedUser/block", async({userId, blockedUserId}, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        console.log("/blockedUser/block", token)
        return await blockedUserService.blockUser(userId, blockedUserId, token)
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

export const unblockUser= createAsyncThunk("/blockedUser/unblock", async({userId, blockedUserId}, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        console.log("/blockedUser/unblock", token)
        return await blockedUserService.unblockedUser(userId,blockedUserId, token)
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


export const blockedUsersSlice = createSlice({
    name: "blockedUsers",
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
        .addCase(getAllBlockedUser.pending, (state) => { state.isLoading = true; })
        .addCase(getAllBlockedUser.fulfilled, (state, action) => {
            console.log(action.payload?.data)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload?.message;
            state.blockedUsers = action.payload.data || [];
        })
        .addCase(getAllBlockedUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.blockedUsers = null;
        })
        .addCase(getAllBlockedUserById.pending, (state) => { state.isLoading = true; })
        .addCase(getAllBlockedUserById.fulfilled, (state, action) => {
            console.log(action.payload?.data)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.blockedUsersById = action.payload.data || [];
        })
        .addCase(getAllBlockedUserById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.blockedUsers = null;
        })
        .addCase(blockedUser.pending, (state) => { state.isLoading = true; })
        .addCase(blockedUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(blockedUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
        .addCase(unblockUser.pending, (state) => { state.isLoading = true; })
        .addCase(unblockUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(unblockUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
    }
});

export const {reset} = blockedUsersSlice.actions
export default blockedUsersSlice.reducer;