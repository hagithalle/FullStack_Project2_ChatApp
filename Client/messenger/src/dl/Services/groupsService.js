import axios from "axios"

const API_URL= "http://127.0.0.1:8000/groups/"

const getAllGroups= async(token)=>{
 

    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log("Service getAllGroups get data:", API_URL, config)

    const {data :response}  = await axios.get(API_URL, config)
    console.log("getAllGroups response:" ,response)

    return response
}
const getGroupById= async(id, token)=>{
    console.log("token:",token)
    
        const config = { headers: { Authorization: `Bearer ${token}` } };
    
        console.log("Service getGroupById get data:", API_URL/id, token)
    
        const {data :response}  = await axios.get(API_URL+id, config)
        console.log("getGroupById response:" ,response)
    
        return response
    }
    
    const updateGroup =async(groupData, token)=>{
        console.log("token:",token)
        
            const config = { headers: { Authorization: `Bearer ${token}` } };
        
            console.log("Service updateGroup get data:", `${API_URL}${groupData.groupId}`, token)
        
            const {data :response}  = await axios.put(`${API_URL}${groupData.groupId}`, groupData,config)
            console.log("updateGroup response:" ,response)
        
            return response
        }

const creatNewGroup= async(group,token)=>{

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const {data: response} = await axios.post(API_URL,group,config)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }
}

const deleteGroup= async(id,token)=>{

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("deleteGroup service: ", id)
        const {data: response} = await axios.delete(API_URL+id,config)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }
}

const getGroupsByUserId= async(userId,token)=>{
    console.log("token:",token, "userId:",userId)
    
        const config = { headers: { Authorization: `Bearer ${token}` } };
    
        console.log("Service getGroupById get data:", `${API_URL}myGroup/${userId}`, token)
    
        const {data :response}  = await axios.get(`${API_URL}myGroup/${userId}`, config)
        console.log("getGroupsByUserId response:" ,response)
    
        return response
    }

const  groupsService = {getAllGroups, creatNewGroup, updateGroup,getGroupById, getGroupsByUserId, deleteGroup}
export default groupsService