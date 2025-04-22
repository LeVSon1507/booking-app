import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bookingApi } from 'api/bookingApi';
import { ReactComponent as PaymentIcon } from '@images/payment-card.svg';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
const PaymentProcess = ({
  room,
  bookingInfo,
  startDate,
  endDate,
  totalDays,
  totalAmount,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const paypalOptions = {
    'client-id':
      process.env.PAYPAL_CLIENT_ID ??
      'AeLhcrJR5isasR4bmqKGOk0Z2Umpa4nChNSix_siHE_ovsZIbLnVI3Bw6lUsE98MqXyFKzHk2Mcc9d1N',
    currency: 'USD',
    intent: 'capture',
  };

  const handleDirectBooking = async () => {
    try {
      setPaymentLoading(true);

      const bookingDetail = {
        room,
        userId: user._id,
        hotelId: room.hotelId,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        totalAmount,
        totalDays: Number(totalDays),
        paymentMethod: 'Cash',
        isPaid: false,
        guestInfo: bookingInfo,
      };

      await bookingApi.createBookingRoom(bookingDetail, {
        headers: { Authorization: token },
      });

      setPaymentLoading(false);

      Swal.fire(
        'Booking Successful',
        'Your booking has been confirmed. You will pay on arrival.',
        'success'
      ).then(() => {
        navigate('/my-booking');
      });
    } catch (error) {
      setPaymentLoading(false);
      Swal.fire('Booking Failed', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const processCreditCardPayment = async (e) => {
    e.preventDefault();

    try {
      setPaymentLoading(true);
      const bookingDetail = {
        room,
        userId: user._id,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        totalAmount,
        totalDays: Number(totalDays),
        paymentMethod: 'Credit Card',
        transactionId: 'cc_' + Date.now(),
        isPaid: true,
        paidAt: Date.now(),
        guestInfo: bookingInfo,
      };

      await bookingApi.createBookingRoom(bookingDetail, {
        headers: { Authorization: token },
      });

      setPaymentLoading(false);

      Swal.fire(
        'Payment Successful',
        'Your booking has been confirmed and payment received.',
        'success'
      ).then(() => {
        navigate('/my-booking');
      });
    } catch (error) {
      setPaymentLoading(false);
      console.error('Payment error:', error);
      Swal.fire('Payment Failed', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="d-flex align-items-center card-header text-white">
              <h3 className="mb-0 mx-2 text-black font-bold">Payment Options</h3>
              <PaymentIcon width={100} height={100} />
            </div>
            <div className="card-body">
              {paymentLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Processing your payment...</p>
                </div>
              ) : paymentMethod === 'credit' ? (
                <div className="credit-card-form">
                  <h4 className="mb-4">Enter Credit Card Details</h4>
                  <form onSubmit={processCreditCardPayment}>
                    <div className="mb-3">
                      <label htmlFor="cardName" className="form-label">
                        Name on Card
                      </label>
                      <input type="text" className="form-control" id="cardName" required />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="expiryDate" className="form-label">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="expiryDate"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cvv"
                          placeholder="XXX"
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setPaymentMethod('')}
                      >
                        Back
                      </button>
                      <button type="submit" className="btn btn-success">
                        Pay {formatter.format(totalAmount)}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="booking-summary mb-4">
                    <h4 className="text-primary1" style={{ fontWeight: 'bold', color: '#e2ba76' }}>
                      Booking Summary
                    </h4>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="text-black">
                          <strong>Room:</strong> {room.name}
                        </p>
                        <p className="text-black">
                          <strong>Check-in:</strong> {startDate.format('DD MMM YYYY')}
                        </p>
                        <p className="text-black">
                          <strong>Check-out:</strong> {endDate.format('DD MMM YYYY')}
                        </p>
                        <p className="text-black">
                          <strong>Duration:</strong> {totalDays}{' '}
                          {totalDays === 1 ? 'night' : 'nights'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-black">
                          <strong>Guest:</strong> {bookingInfo.name}
                        </p>
                        <p className="text-black">
                          <strong>Email:</strong> {bookingInfo.email}
                        </p>
                        <p className="text-black">
                          <strong>Phone:</strong> {bookingInfo.phone}
                        </p>
                        <p className="text-black">
                          <strong>Total Amount:</strong> {formatter.format(totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="payment-methods">
                    <h4
                      className="mb-3 text-primary1"
                      style={{ fontWeight: 'bold', color: '#e2ba76' }}
                    >
                      Select Payment Method
                    </h4>

                    <div className="payment-option mb-4">
                      <h5>Pay with PayPal</h5>
                      <p className="text-muted">Safe and secure payment with PayPal</p>
                      <div className="paypal-button-container w-50">
                        <PayPalScriptProvider options={paypalOptions}>
                          <PayPalButtons
                            style={{ layout: 'horizontal' }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    description: `Room booking: ${room.name}`,
                                    amount: {
                                      value: totalAmount.toString(),
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={async (data, actions) => {
                              const order = await actions.order.capture();

                              try {
                                setPaymentLoading(true);

                                const bookingDetail = {
                                  room,
                                  userId: user._id,
                                  startDate: startDate.format('YYYY-MM-DD'),
                                  endDate: endDate.format('YYYY-MM-DD'),
                                  totalAmount,
                                  totalDays: Number(totalDays),
                                  paymentMethod: 'PayPal',
                                  transactionId: order.id,
                                  isPaid: true,
                                  paidAt: Date.now(),
                                  guestInfo: bookingInfo,
                                };

                                await bookingApi.createBookingRoom(bookingDetail, {
                                  headers: { Authorization: token },
                                });

                                setPaymentLoading(false);

                                Swal.fire(
                                  'Payment Successful',
                                  'Your booking has been confirmed and payment received.',
                                  'success'
                                ).then(() => {
                                  navigate('/my-booking');
                                });
                              } catch (error) {
                                setPaymentLoading(false);
                                console.error('Payment error:', error);
                                Swal.fire(
                                  'Payment Failed',
                                  error.response?.data?.message || 'Something went wrong',
                                  'error'
                                );
                              }
                            }}
                            onError={(err) => {
                              console.error('PayPal Error:', err);
                              Swal.fire(
                                'Payment Error',
                                'There was an error processing your PayPal payment. Please try again.',
                                'error'
                              );
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>

                    <div className="payment-option mb-4">
                      <h5>Pay with Credit Card</h5>
                      <p className="text-muted">Secure payment with credit card</p>
                      <button
                        className="btn btn-outline-primary btn-lg w-50"
                        onClick={() => setPaymentMethod('credit')}
                      >
                        Enter Card Details
                      </button>
                    </div>

                    <div className="payment-option">
                      <h5>Pay on Arrival</h5>
                      <p className="text-muted">Pay cash or card when you arrive</p>
                      <button
                        className="btn btn-outline-secondary btn-lg w-50"
                        onClick={handleDirectBooking}
                      >
                        Book Now, Pay Later
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={onBack}
                  disabled={paymentLoading}
                >
                  Back to Booking Details
                </button>
                <div className="secure-payment-info d-flex align-items-center">
                  <i className="fas fa-lock me-2"></i>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
