  
import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import users from './userReducer'
import booking from './bookingReducer'

export default combineReducers({
    auth,
    token,
    users,
    booking
})