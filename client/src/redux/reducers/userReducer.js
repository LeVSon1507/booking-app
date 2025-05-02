import { GET_ALL_USERS_SUCCESS } from 'redux/contants';

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_USERS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default usersReducer;
