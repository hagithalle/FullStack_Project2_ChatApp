import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupsService from "../Services/groupsService";

const initialState={
    groups: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    currentGroupSocket:null
}

export const getAllGroups= createAsyncThunk("/groups/getAll", async(_, thunkAPI)=>{
    try {
        const token =  sessionStorage.getItem("token")
        return await groupsService.getAllGroups(token)
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

export const createNewGroup= createAsyncThunk("/groups/add", async(group, thunkAPI)=>{
    try {
        const token = sessionStorage.getItem("token")
        return await groupsService.creatNewGroup(group,token)
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

export const updateGroup= createAsyncThunk("/groups/update", async(group, thunkAPI)=>{
    try {
        const token = sessionStorage.getItem("token")
        return await groupsService.updateGroup(group,token)
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

export const deleteGroup= createAsyncThunk("/groups/delete", async(id, thunkAPI)=>{
    try {
        const token = sessionStorage.getItem("token")
        console.log("/groups/delete: ", id)
        return await groupsService.deleteGroup(id,token)
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

export const getGroupById= createAsyncThunk("/groups/getById", async(id, thunkAPI)=>{
    try {
        console.log("getGroupById")
        //const token = thunkAPI.getState().auth.user.token
        const token =  sessionStorage.getItem("token")
        console.log("getGroupById token:", token)
        return await groupsService.getGroupById(id,token)
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

export const getGroupsByUserId= createAsyncThunk("/groups/getGroupsByUserId", async(id, thunkAPI)=>{
    try {
        console.log("getGroupsByUserId:", id)
        //const token = thunkAPI.getState().auth.user.token
        const token =  sessionStorage.getItem("token")
        console.log("getGroupsByUserId token:", token)
        return await groupsService.getGroupsByUserId(id,token)
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


export const groupsSlice = createSlice({
    name: "groups",
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
        .addCase(getAllGroups.pending, (state) => { state.isLoading = true; })
        .addCase(getAllGroups.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.groups = action.payload.data;
        })
        .addCase(getAllGroups.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.groups = null;
        })
        .addCase(createNewGroup.pending, (state) => { state.isLoading = true; })
        .addCase(createNewGroup.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(createNewGroup.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
        .addCase(updateGroup.pending, (state) => { state.isLoading = true; })
        .addCase(updateGroup.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(updateGroup.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
        .addCase(getGroupById.pending, (state) => { state.isLoading = true; })
        .addCase(getGroupById.fulfilled, (state, action) => {
            console.log("XXX:", action.payload.data)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.currentGroupSocket = action.payload.data;
        })
        .addCase(getGroupById.rejected, (state, action) => {
            console.log("YYY:",action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.groups = null;
        })

        .addCase(getGroupsByUserId.pending, (state) => { state.isLoading = true; })
        .addCase(getGroupsByUserId.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            state.groups = action.payload.data;
        })
        .addCase(getGroupsByUserId.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
            state.groups = null;
        })
        .addCase(deleteGroup.pending, (state) => { state.isLoading = true; })
        .addCase(deleteGroup.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload.message;
        })
    }
});

export const {reset} = groupsSlice.actions
export default groupsSlice.reducer;