import axios from "axios"

const API_URL= "http://127.0.0.1:8000/blockedUser/"

// Action to block a user
const blockUser= async(userId, blockUserId, token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try{
       
        console.log("Service blockUser get data:",`${API_URL}block`, {userId, blockUserId}, config)
    
        const {data :response}  = await axios.post(`${API_URL}block`, {userId, blockUserId}, config)
        console.log("blockUser response:" ,response)
    
        return response
    }
    catch (error) {
        console.error(error);
    }
}

// Action to unblock a user
const unblockedUser= async(userId, blockUserId, token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try{
       
        console.log("Service unblockedUser get data:", API_URL, config)
    
        const {data :response}  = await axios.post(`${API_URL}unblock`, {userId, blockUserId}, config)
        console.log("unblockedUser response:" ,response)
    
        return response
    }
    catch (error) {
        console.error(error);
    }
}


// Action to fetch blocked users

const fetchBlockedUsers= async(token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try{
       
        console.log("Service fetchBlockedUsers get data:", API_URL, config)
    
        const {data :response}  = await axios.get(API_URL, config)
        console.log("fetchBlockedUsers response:" ,response)
    
        return response
    }
    catch (error) {
        console.error(error);
    }
}


// Action to fetch blocked users by id

const fetchBlockedUsersById= async(userId,token)=>{
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try{
       
        console.log("Service fetchBlockedUsersById put data:", `${API_URL}blocked-users/${userId}`, config)
    
        const {data :response}  = await axios.put(`${API_URL}blocked-users/${userId}`, config)
        console.log("fetchBlockedUsers response:" ,response)
    
        return response
    }
    catch (error) {
        console.error(error);
    }
}


const  blockedUserService = {blockUser, unblockedUser, fetchBlockedUsers, fetchBlockedUsersById}
export default blockedUserService