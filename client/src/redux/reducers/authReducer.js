import { GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN } from 'redux/contants';

const initialState = {
  user: [],
  isLogged: false,
  isAdmin: false,
  isLoading: true,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLogged: true,
      };
    case GET_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user.user,
        isAdmin: action.payload.isAdmin,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
