import axios from "axios"

const URL_API= "http://127.0.0.1:8000/users/"

const login= async(user)=>{
    try {
        const {data: response} = await axios.post(URL_API+"login", user)
        if(response.data?.token){
            response.data.user.token = response.data.token
            const { password,token, ...userWithoutPassword } = response.data.user;
            await sessionStorage.setItem("user", JSON.stringify(userWithoutPassword))
            await sessionStorage.setItem("token", response.data.token)
        }
        else{
            console.log("No token received in response")
        }
        return response.data
        
    } 
    catch (error) {
        throw error.response ? error.response.data : error;
    }
}

const register= async(user)=>{
    try {

        const {data: response} = await axios.post(URL_API+"register", user)
        console.log("response:", response)
        return response       
    } 
    catch (error) {
        throw error.response ? error.response.data : error;
    }
}

const logOut= ()=>{
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    window.location.reload()
}

const  authService = {login, register, logOut}
export default authService