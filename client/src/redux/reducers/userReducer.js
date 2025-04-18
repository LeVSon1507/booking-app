import { GET_ALL_USERS_SUCCESS } from 'redux/contants'

const users =[]

const usersReducer = (state = users, action) => {
    switch(action.type){
        case GET_ALL_USERS_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export default usersReducer