import React from 'react';
import { Card, Typography, Divider, Avatar } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const GuestInfo = ({ booking, user }) => (
  <Card title="Guest Information" style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <Avatar src={user.avatar} size={64} style={{ marginRight: '16px' }} />
      <div>
        <Text strong style={{ fontSize: '16px' }}>
          {booking.guestDetails.name}
        </Text>
        <br />
        <Text type="secondary">
          <MailOutlined style={{ marginRight: '8px' }} />
          {booking.guestDetails.email}
        </Text>
      </div>
    </div>

    {booking.specialRequests && (
      <>
        <Divider style={{ margin: '12px 0' }} />
        <Title level={5}>Special Requests:</Title>
        <Paragraph>{booking.specialRequests}</Paragraph>
      </>
    )}
  </Card>
);

export default GuestInfo;
