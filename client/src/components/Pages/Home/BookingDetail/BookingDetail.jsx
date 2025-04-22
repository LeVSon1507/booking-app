import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  MailOutlined,
  StarOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Button,
  Row,
  Col,
  Image,
  Carousel,
  Divider,
  Space,
  Statistic,
  Modal,
  Avatar,
  Rate,
  Form,
  Input,
  message,
  Result,
  Spin,
  Upload,
} from 'antd';
import moment from 'moment';
import MetaData from 'components/utils/MetaData';
import { bookingApi } from 'api/bookingApi';
import { reviewApi } from 'api/reviewApi';
import { uploadApi } from 'api/uploadApi';
import { useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReviewForm = ({ form, onFinish, booking, uploading, fileList, setFileList }) => {
  console.log(booking.paymentMethod);

  const beforeUpload = (file) => {
    if (!file) return false;

    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    if (file.size) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
    }

    return true;
  };

  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PictureOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="rating"
        label="Rating"
        rules={[{ required: true, message: 'Please rate your stay' }]}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        name="title"
        label="Review Title"
        rules={[{ required: true, message: 'Please enter a title for your review' }]}
      >
        <Input placeholder="Summarize your experience" />
      </Form.Item>

      <Form.Item
        name="comment"
        label="Your Review"
        rules={[{ required: true, message: 'Please share your experience' }]}
      >
        <TextArea rows={4} placeholder="Tell us about your stay..." />
      </Form.Item>

      {booking.paymentMethod === 'CASH' && (
        <Form.Item
          name="evidence"
          required
          label="Upload Payment Evidence"
          extra="Please upload images of your payment receipt"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            customRequest={({ file, onSuccess }) => {
              setFileList([...fileList, file]);
              if (onSuccess) onSuccess();
            }}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={uploading}
          disabled={booking.paymentMethod === 'CASH' && fileList.length === 0}
        >
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingDetail, setBookingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const token = useSelector((state) => state.token);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const getBooking = useCallback(async () => {
    return await bookingApi.getBookingById(`${id}`, {
      headers: { Authorization: token },
    });
  }, [token, id]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBooking();
        setBookingDetail(response.data);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        setLoading(false);
        setError(error.message || 'Failed to load booking details');
        console.log(error);
      }
    })();
  }, [getBooking]);

  const handleCancelBooking = () => {
    setCancelModalVisible(false);
    message.info('This feature is under development!');
  };
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleReviewSubmit = async (values) => {
    try {
      setUploading(true);
      const { booking, room } = bookingDetail;

      const reviewData = {
        userId: currentUser._id,
        userName: currentUser.name,
        bookingId: booking._id,
        roomId: room._id,
        rating: values.rating,
        title: values.title,
        comment: values.comment,
      };

      if (booking.paymentMethod === 'CASH' && fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('evidence', file);
        });

        const uploadResponse = await uploadApi.uploadEvidence(formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        });

        reviewData.evidenceUrls = uploadResponse.data.evidenceUrls;
      }

      await reviewApi.addReview(booking.hotelId, reviewData, {
        headers: { Authorization: token },
      });

      setReviewModalVisible(false);
      message.success('Review submitted successfully!');

      const response = await getBooking();
      setBookingDetail(response.data);

      reviewForm.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Failed to submit review. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImagePreview = (image) => {
    setCurrentImage(image);
    setImagePreviewVisible(true);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" tip="Loading booking details..." />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <Result
  //       status="error"
  //       title="Failed to load booking"
  //       subTitle={error}
  //       extra={[
  //         <Button type="primary" key="back" onClick={() => navigate('/')}>
  //           Back to Bookings
  //         </Button>,
  //       ]}
  //     />
  //   );
  // }

  const { booking, hotel, room, user } = bookingDetail || {};

  if (!booking || !hotel || !room || !user) {
    return (
      <Result
        status="warning"
        title="Incomplete booking data"
        subTitle="Some booking information is missing. Please try again later."
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/bookings')}>
            Back to Bookings
          </Button>,
        ]}
      />
    );
  }

  const HotelInfo = () => (
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

  const BookingSummary = () => {
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

  const GuestInfo = () => (
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

  return (
    <Fragment>
      <MetaData title={`Booking - ${hotel.name}`} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: '16px' }}
          onClick={() => navigate('/my-booking')}
        >
          Back to My Bookings
        </Button>

        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '16px' }}>
          <Col flex="auto">
            <Title level={2} style={{ margin: 0 }}>
              Booking Details
            </Title>
          </Col>
          <Col>
            <Tag
              color={booking.status === 'booked' ? 'success' : 'error'}
              style={{ fontSize: '16px', padding: '4px 12px' }}
            >
              {booking.status === 'booked' ? 'Booked' : 'Cancelled'}
            </Tag>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <HotelInfo />
          </Col>

          <Col xs={24} lg={8}>
            <BookingSummary />
            <GuestInfo />

            <Space direction="vertical" style={{ width: '100%' }}>
              {booking.status === 'booked' && !booking.hasReviewed && (
                <Button
                  type="primary"
                  icon={<StarOutlined />}
                  block
                  onClick={() => setReviewModalVisible(true)}
                >
                  Leave a Review
                </Button>
              )}

              {booking.status === 'booked' && (
                <Button
                  danger
                  icon={<MessageOutlined />}
                  block
                  onClick={() => setCancelModalVisible(true)}
                >
                  Cancel Booking
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Card style={{ marginTop: '24px', backgroundColor: '#f5f5f5' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary">
                Booked on: {moment(booking.createdAt).format('MMM DD, YYYY, HH:mm')}
              </Text>
            </Col>
          </Row>
        </Card>
      </div>

      <Modal
        title="Cancel Booking"
        open={cancelModalVisible}
        onOk={handleCancelBooking}
        onCancel={() => setCancelModalVisible(false)}
        okText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
        okButtonProps={{ danger: true }}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Title level={4} style={{ color: '#ff4d4f' }}>
            Are you sure you want to cancel this booking?
          </Title>
          <Paragraph>
            This action cannot be undone. Please check the hotel's cancellation policy for any
            applicable fees.
          </Paragraph>
        </div>
      </Modal>

      <Modal
        title="Leave a Review"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          reviewForm.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <ReviewForm
          form={reviewForm}
          onFinish={handleReviewSubmit}
          booking={booking}
          uploading={uploading}
          fileList={fileList}
          setFileList={setFileList}
        />
      </Modal>

      <Image
        width={0}
        style={{ display: 'none' }}
        src={currentImage}
        preview={{
          visible: imagePreviewVisible,
          onVisibleChange: (visible) => setImagePreviewVisible(visible),
          src: currentImage,
        }}
      />
    </Fragment>
  );
};

export default BookingDetail;
