import React from 'react';
import { Card, Typography, Tag, Row, Col, Image, Carousel, Divider, Space, Rate } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const HotelInfo = ({ hotel, room, handleImagePreview }) => (
  <Card
    style={{ marginBottom: '24px' }}
    cover={
      <Carousel autoplay>
        {hotel.imageUrls.map((url, index) => (
          <div key={index}>
            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
              <Image
                src={url}
                alt={`${hotel.name} - Image ${index + 1}`}
                style={{ width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                preview={false}
                onClick={() => handleImagePreview(url)}
              />
            </div>
          </div>
        ))}
      </Carousel>
    }
  >
    <Title level={3}>{hotel.name}</Title>
    <Paragraph>
      <EnvironmentOutlined /> {hotel.address}, {hotel.city}
    </Paragraph>

    <Space>
      <Rate disabled allowHalf value={hotel?.rating} style={{ fontSize: '14px' }} />
      <Text>{hotel?.rating?.toFixed(1)}</Text>
    </Space>

    <Divider />

    <Title level={4}>Room: {room.name}</Title>
    <Tag color="blue">{room.type}</Tag>
    <Paragraph style={{ marginTop: '12px' }}>{room.description}</Paragraph>

    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
      {room.imageUrls.map((url, index) => (
        <Col span={12} key={index}>
          <Image
            src={url}
            alt={`Room Image ${index + 1}`}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            preview={false}
            onClick={() => handleImagePreview(url)}
          />
        </Col>
      ))}
    </Row>
  </Card>
);

export default HotelInfo;
