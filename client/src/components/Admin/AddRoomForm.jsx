import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Card,
  Tag,
  Space,
  Divider,
  message,
  Spin,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { roomApi } from 'api/roomApi';
import { uploadApi } from 'api/uploadApi';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddRoomForm = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [amenity, setAmenity] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const token = localStorage.getItem('token');
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Family', 'Executive'];

  const handleAddAmenity = () => {
    if (amenity && !amenities.includes(amenity)) {
      setAmenities([...amenities, amenity]);
      setAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter((item) => item !== amenityToRemove));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    const roomData = {
      ...values,
      amenities,
      imageUrls,
      hotelId,
    };

    try {
      let uploadedImageUrls = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('images', image);
        });

        const uploadResponse = await uploadApi.uploadReviewImages(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        });
        uploadedImageUrls = uploadResponse.data;
      }
      setLoading(true);

      await roomApi.createRoom({
        ...roomData,
        imageUrls: uploadedImageUrls?.imageUrls,
      });
      message.success('Room added successfully!');
    } catch (error) {
      console.error('Error adding room:', error);
      message.error(error.response?.data?.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card>
        <Title level={2}>Add New Room</Title>
        <Divider />

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              capacity: 2,
              type: 'Standard',
              isAvailable: true,
            }}
          >
            <Form.Item
              name="name"
              label="Room Name"
              rules={[{ required: true, message: 'Please enter room name' }]}
            >
              <Input placeholder="Enter room name" />
            </Form.Item>

            <div style={{ display: 'flex', gap: '20px' }}>
              <Form.Item
                name="price"
                label="Price per Night"
                rules={[{ required: true, message: 'Please enter price' }]}
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Enter price"
                />
              </Form.Item>

              <Form.Item name="capacity" label="Capacity" style={{ flex: 1 }}>
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <Form.Item
              name="type"
              label="Room Type"
              rules={[{ required: true, message: 'Please select room type' }]}
            >
              <Select placeholder="Select room type">
                {roomTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea rows={4} placeholder="Enter room description" />
            </Form.Item>

            <Divider orientation="left">Amenities</Divider>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Add amenity"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                onPressEnter={handleAddAmenity}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAmenity}>
                Add
              </Button>
            </Space>

            <div style={{ marginBottom: 16 }}>
              {amenities.map((item) => (
                <Tag
                  closable
                  onClose={() => handleRemoveAmenity(item)}
                  style={{ marginBottom: 8 }}
                  key={item}
                >
                  {item}
                </Tag>
              ))}
            </div>

            <Divider orientation="left">Images</Divider>
            <Space
              style={{
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
              }}
            >
              <Input
                placeholder="Image URL"
                multiple
                type="file"
                accept="image/*"
                onPressEnter={handleImageChange}
                onChange={handleImageChange}
              />
              <small className="form-text text-muted">
                You can select multiple images. Recommended size: 1200x800 pixels.
              </small>
            </Space>

            <div className="image-previews mt-3">
              <div className="row">
                {imageUrls.map((url, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="image-preview-container">
                      <img src={url} alt={`Preview ${index + 1}`} className="img-thumbnail" />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger remove-image"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                Add Room
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate(`/hotels/${hotelId}`)}
                size="large"
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default AddRoomForm;
