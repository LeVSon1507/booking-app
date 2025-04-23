import React from 'react';
import { Form, Rate, Input, Button, Upload, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ReviewForm = ({ form, onFinish, booking, uploading, fileList, setFileList }) => {
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

export default ReviewForm;
