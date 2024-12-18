import axios from "axios"

const URL_API= "http://127.0.0.1:8000/messages/"

const getAllmessage= async(token)=>{


    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const {data: response} = await axios.get(URL_API,config)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }
}

const creatNewMessage= async(messageData,token)=>{

    try {
        console.log("messageData: ", messageData)
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const {data: response} = await axios.post(URL_API,messageData,config)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }
}

const getChatHistory = async(id,token)=>{
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
console.log("getChatHistory: ",`${URL_API}history/${id}`)
        const {data: response} = await axios.get(`${URL_API}/history/${id}`,config)

        console.log("getChatHistory response: ",response)
        return response
      
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }
}

const  messagesService = {getAllmessage, creatNewMessage, getChatHistory}
export default messagesService