import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';
import {
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Image,
  Space,
  Modal,
  Form,
  message,
  Result,
  Spin,
  Card,
} from 'antd';
import moment from 'moment';
import MetaData from 'components/utils/MetaData';
import { bookingApi } from 'api/bookingApi';
import { reviewApi } from 'api/reviewApi';
import { uploadApi } from 'api/uploadApi';
import { useSelector } from 'react-redux';

import HotelInfo from './HotelInfo';
import BookingSummary from './BookingSummary';
import GuestInfo from './GuestInfo';
import ReviewInfo from './ReviewInfo';
import ReviewForm from './ReviewForm';

const { Title, Text } = Typography;

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingDetail, setBookingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [reviewData, setReviewData] = useState(null);

  const token = useSelector((state) => state.token);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const getBooking = useCallback(async () => {
    const bookingResponse = await bookingApi.getBookingById(`${id}`, {
      headers: { Authorization: token },
    });

    if (bookingResponse.data.booking.hasReviewed && bookingResponse.data.booking.reviewId) {
      try {
        const reviewResponse = await reviewApi.getReviewById(
          bookingResponse.data.booking.reviewId,
          { headers: { Authorization: token } }
        );
        setReviewData(reviewResponse.data);
      } catch (error) {
        console.log('Error fetching review:', error);
      }
    }

    return bookingResponse;
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

  const handleReviewSubmit = async (values) => {
    try {
      setUploading(true);
      const { booking, room, hotel } = bookingDetail;

      if (booking.hasReviewed) {
        message.error('You have already submitted a review for this booking');
        return;
      }
      const reviewData = {
        userId: currentUser._id,
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

      if (fileList.length > 0) {
        const imageFormData = new FormData();
        fileList.forEach((file) => {
          imageFormData.append('images', file);
        });

        const imageUploadResponse = await uploadApi.uploadReviewImages(imageFormData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        });

        reviewData.imageUrls = imageUploadResponse.data.imageUrls;
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

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load booking"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/my-booking')}>
            Back to Bookings
          </Button>,
        ]}
      />
    );
  }

  const { booking, hotel, room, user } = bookingDetail || {};

  if (!booking || !hotel || !room || !user) {
    return (
      <Result
        status="warning"
        title="Incomplete booking data"
        subTitle="Some booking information is missing. Please try again later."
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/my-booking')}>
            Back to Bookings
          </Button>,
        ]}
      />
    );
  }

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
            <HotelInfo hotel={hotel} room={room} handleImagePreview={handleImagePreview} />
            {booking.hasReviewed && (
              <ReviewInfo reviewData={reviewData} handleImagePreview={handleImagePreview} />
            )}
          </Col>

          <Col xs={24} lg={8}>
            <BookingSummary booking={booking} />
            <GuestInfo booking={booking} user={user} />

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

              {booking.status === 'booked' && !booking.hasReviewed ? (
                <Button
                  type="primary"
                  icon={<StarOutlined />}
                  block
                  onClick={() => setReviewModalVisible(true)}
                >
                  Leave a Review
                </Button>
              ) : booking.hasReviewed ? (
                <Button type="default" icon={<StarOutlined />} block disabled>
                  Review Submitted
                </Button>
              ) : null}
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
          <Text>
            This action cannot be undone. Please check the hotel's cancellation policy for any
            applicable fees.
          </Text>
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
