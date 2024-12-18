import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./dl/slices/authSlice"
import usersReducer from "./dl/slices/usersSlice"
import groupReducer from "./dl/slices/groupsSlice"
import messagesReducer from "./dl/slices/messageSlice"
import blockedUserRefucer from "./dl/slices/blockedUserSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer, 
        users: usersReducer,
        groups: groupReducer,
        messages: messagesReducer,
        blockedUsers: blockedUserRefucer

        
    }
});