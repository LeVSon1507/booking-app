import axiosClient from "./axiosClient"

export const uploadApi = {
    uploadAvatar(data,token){
        const url ='/api/upload_avatar'
        return axiosClient.post(url, data,token)
    },
}