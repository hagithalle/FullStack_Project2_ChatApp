import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messagesService from "../Services/messageService";

const initialState={
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getAllmessage= createAsyncThunk("/messages/getAll", async(_, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        return await messagesService.getAllmessage(token)
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

export const createNewMessage= createAsyncThunk("/messages/add", async(messageData, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        return await messagesService.creatNewMessage(messageData,token)
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
export const getChatHistory= createAsyncThunk("/messages/getHistory", async(id, thunkAPI)=>{
    try {
        console.log("getChatHistory")
        const token =  sessionStorage.getItem("token")
        return await messagesService.getChatHistory(id,token)
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

export const messagesSlice = createSlice({
    name: "messages",
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
        .addCase(getAllmessage.pending, (state) => { state.isLoading = true; })
        .addCase(getAllmessage.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.messages = action.payload.data;
        })
        .addCase(getAllmessage.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.messages = action.payload.data;
        })
        .addCase(createNewMessage.pending, (state) => { state.isLoading = true; })
        .addCase(createNewMessage.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(createNewMessage.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
        
        .addCase(getChatHistory.pending, (state) => { state.isLoading = true; })
        .addCase(getChatHistory.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.messages = action.payload.data;
            state.message = action.payload.message;
        })
        .addCase(getChatHistory.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
    }
});

export const {reset} = messagesSlice.actions
export default messagesSlice.reducer;