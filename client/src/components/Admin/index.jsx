import React, { Fragment } from 'react';
import { Tabs } from 'antd';
import GetAllUser from './GetAllUser';
import GetAllBooking from './GetAllBooking';
import MetaData from 'components/utils/MetaData';
import GetAllRoom from './GetAllRoom';

const { TabPane } = Tabs;

const Admin = () => {
  return (
     <Fragment>
       <MetaData title="Admin"/>
       <div className="mt-3">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Bookings" key="1">
            <GetAllBooking/>
          </TabPane>
          <TabPane tab="Người dùng" key="2">
            <GetAllUser />
          </TabPane>
          <TabPane tab="Phòng" key="3">
            <GetAllRoom />
          </TabPane>
        </Tabs>
      </div>
     </Fragment>
  );
};

export default Admin;
