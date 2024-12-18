import axios from "axios"

const API_URL= "http://127.0.0.1:8000/users/"

const getAllUsers= async(token)=>{

console.log("token:",token)
   /* try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const {data: response} = await axios.get(URL_API,config)
        console.log(response)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }*/

    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log("Service getAllUsers get data:", API_URL, config)

    const {data :response}  = await axios.get(API_URL, config)
    console.log("getAllUsers response:" ,response)

    return response
}
const getUserById= async(id, token)=>{
console.log("token:",token)
   /* try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const {data: response} = await axios.get(URL_API,config)
        console.log(response)
        return response
        
    } catch (error) 
    {
        throw error.response ? error.response.data : error;
    }*/

    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log("Service getUserById get data:", API_URL+id, token)

    const {data :response}  = await axios.get(API_URL+id, config)
    console.log("getUserById response:" ,response)

    return response
}


const  usersService = {getAllUsers, getUserById}
export default usersService