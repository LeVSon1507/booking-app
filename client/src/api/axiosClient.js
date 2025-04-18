import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type' : 'application/json'
    },
    paramsSerializer: prams => queryString.stringify(prams),
})


axiosClient.interceptors.request.use(async(config) =>{
    return config
})
axiosClient.interceptors.request.use(async(res) =>{
    // if(res && res.data){
    //     return res.data
    // }
    return res
},(err)=>{
    throw err
})

export default axiosClient