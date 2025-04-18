import userApi from 'api/userApi'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { showErrMsg, showSuccessMsg } from '../utils/Notification'

function ActivationEmail() {
    const {activation_token} = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                    const res = await userApi.activeEmail( {activation_token})
                    setSuccess(res.data.message)
                } catch (err) {
                    err.response.data.message && setErr(err.response.data.message)
                }
            }
            activationEmail()
        }
    },[activation_token])

    console.log(activation_token);

    return (
        <div className="active_page">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}

export default ActivationEmail