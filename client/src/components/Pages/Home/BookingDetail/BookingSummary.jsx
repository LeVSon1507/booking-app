import React from 'react';
import { Card, Descriptions, Divider, Statistic } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import moment from 'moment';

const BookingSummary = ({ booking }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY');
  };

  return (
    <Card title="Reservation Summary" style={{ marginBottom: '24px' }}>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Check-in
            </>
          }
          labelStyle={{ fontWeight: 'bold' }}
        >
          {formatDate(booking.startDate)}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Check-out
            </>
          }
          labelStyle={{ fontWeight: 'bold' }}
        >
          {formatDate(booking.endDate)}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <ClockCircleOutlined /> Duration
            </>
          }
          labelStyle={{ fontWeight: 'bold' }}
        >
          {booking.totalDays} {booking.totalDays === 1 ? 'night' : 'nights'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Statistic
        title="Total Amount"
        value={booking.totalAmount}
        precision={2}
        prefix="$"
        style={{ marginBottom: '16px' }}
      />

      <Descriptions column={1} size="small">
        <Descriptions.Item
          label={
            <>
              <CreditCardOutlined /> Payment Method
            </>
          }
          labelStyle={{ fontWeight: 'bold' }}
        >
          {booking.paymentMethod}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default BookingSummary;
