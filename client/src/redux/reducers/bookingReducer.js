import { GET_BOOKING_USER_SUCCESS } from 'redux/contants';

const initialState = {
  bookings: [],
  loading: true,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOKING_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
