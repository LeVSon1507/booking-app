import React from 'react';
import { Card, Typography, Divider, Rate, Row, Col, Image } from 'antd';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const ReviewInfo = ({ reviewData, handleImagePreview }) => {
  if (!reviewData) return null;

  return (
    <Card title="Your Review" style={{ marginBottom: '24px' }}>
      <Rate disabled value={reviewData.rating} style={{ marginBottom: '8px' }} />
      <Title level={5}>{reviewData.title}</Title>
      <Paragraph>{reviewData.comment}</Paragraph>

      {reviewData.imageUrls && reviewData.imageUrls.length > 0 && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          <Title level={5}>Your Photos:</Title>
          <Row gutter={[8, 8]}>
            {reviewData.imageUrls.map((url, index) => (
              <Col span={8} key={index}>
                <Image
                  src={url}
                  alt={`Review Image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  onClick={() => handleImagePreview(url)}
                  preview={false}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      <Divider style={{ margin: '12px 0' }} />
      <Text type="secondary">
        Submitted on: {moment(reviewData.createdAt).format('MMM DD, YYYY')}
      </Text>
    </Card>
  );
};

export default ReviewInfo;
