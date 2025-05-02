import { GET_TOKEN, CLEAR_TOKEN } from 'redux/contants';

const getInitialToken = () => {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) return null;

  try {
    return storedToken;
  } catch (error) {
    console.error('Invalid token in localStorage:', error);
    localStorage.removeItem('token');
    return null;
  }
};

const tokenReducer = (state = getInitialToken(), action) => {
  switch (action.type) {
    case GET_TOKEN:
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      }
      return action.payload;
    case CLEAR_TOKEN:
      localStorage.removeItem('token');
      return null;
    default:
      return state;
  }
};

export default tokenReducer;
