import 'antd/dist/antd.css';
import AOS from "aos";
import "aos/dist/aos.css";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import DataProvider from './redux/store';

AOS.init({
  duration: 1000
});
ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
