import React, { useState } from 'react';
import { Form, Input, Rate, Upload, Button, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { uploadApi } from '../../../../api/uploadApi';

const { TextArea } = Input;
const { Dragger } = Upload;

const ReviewForm = ({ form, onFinish, booking, uploading }) => {
  const [reviewImages, setReviewImages] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleReviewImagesChange = ({ fileList: newFileList }) => {
    setReviewImages(newFileList);
  };

  const handleEvidenceChange = ({ fileList: newFileList }) => {
    setEvidenceFiles(newFileList);
  };

  const validateEvidence = (_, value) => {
    if (booking.paymentMethod === 'CASH' && evidenceFiles.length === 0) {
      return Promise.reject('Please upload payment evidence');
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      setUploadingImages(true);
      let reviewImageUrls = [];
      let evidenceUrls = [];

      // Upload review images
      if (reviewImages.length > 0) {
        const imageFormData = new FormData();
        reviewImages.forEach((file) => {
          if (file.originFileObj) {
            imageFormData.append('images', file.originFileObj);
          }
        });

        const imageUploadResponse = await uploadApi.uploadReviewImages(imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token'),
          },
        });
        reviewImageUrls = imageUploadResponse.data.imageUrls;
      }

      // Upload evidence if payment method is CASH
      if (booking.paymentMethod === 'CASH' && evidenceFiles.length > 0) {
        const evidenceFormData = new FormData();
        evidenceFiles.forEach((file) => {
          if (file.originFileObj) {
            evidenceFormData.append('evidence', file.originFileObj);
          }
        });

        const evidenceUploadResponse = await uploadApi.uploadEvidence(evidenceFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token'),
          },
        });
        evidenceUrls = evidenceUploadResponse.data.evidenceUrls;
      }

      const formData = {
        ...values,
        imageUrls: reviewImageUrls,
        evidenceUrls: booking.paymentMethod === 'CASH' ? evidenceUrls : [],
      };
      await onFinish(formData);
    } catch (error) {
      message.error('Failed to upload images. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ rating: 5 }}>
      <Form.Item
        name="rating"
        label="Rating"
        rules={[{ required: true, message: 'Please rate your stay' }]}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title for your review' }]}
      >
        <Input placeholder="Give your review a title" />
      </Form.Item>

      <Form.Item
        name="comment"
        label="Review"
        rules={[{ required: true, message: 'Please write your review' }]}
      >
        <TextArea rows={4} placeholder="Share your experience with this hotel" />
      </Form.Item>

      {/* Upload Review Images */}
      <Form.Item
        required
        label="Review Images"
        extra="Upload images related to your stay (optional)"
      >
        <Dragger
          multiple
          fileList={reviewImages}
          beforeUpload={beforeUpload}
          onChange={handleReviewImagesChange}
          maxCount={5}
          name="images"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag images to this area to upload</p>
          <p className="ant-upload-hint">
            Support for multiple images. Max 5 images, each less than 5MB.
          </p>
        </Dragger>
      </Form.Item>

      {/* Upload Evidence for Cash Payment */}
      {booking.paymentMethod === 'CASH' && (
        <Form.Item
          name="evidence"
          label="Payment Evidence"
          extra="Upload proof of payment (required for cash payment)"
          required
          rules={[
            { required: true, message: 'Please upload payment evidence' },
            { validator: validateEvidence },
          ]}
        >
          <Upload
            multiple
            fileList={evidenceFiles}
            beforeUpload={beforeUpload}
            onChange={handleEvidenceChange}
            maxCount={3}
            name="evidence"
          >
            <Button icon={<UploadOutlined />}>Upload Evidence</Button>
          </Upload>
          <p className="text-sm text-gray-500 mt-2">
            Please upload clear images of your payment receipt or proof of payment. Maximum 3
            images, each less than 5MB.
          </p>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading || uploadingImages}
          block
          disabled={booking.paymentMethod === 'CASH' && evidenceFiles.length === 0}
        >
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;
