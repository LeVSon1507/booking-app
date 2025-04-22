const sgMail = require("@sendgrid/mail");
const moment = require("moment");

const sendBookingConfirmationEmail = async (booking, room, user, hotel) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const formattedStartDate = moment(booking.startDate, "MM-DD-YYYY").format(
      "DD MMM YYYY"
    );
    const formattedEndDate = moment(booking.endDate, "MM-DD-YYYY").format(
      "DD MMM YYYY"
    );
    const issueDate = moment().format("DD MMM YYYY");

    const pricePerNight = (booking.totalAmount / booking.totalDays).toFixed(2);

    const roomTotal = (pricePerNight * booking.totalDays).toFixed(2);
    const serviceFee = (roomTotal * 0.05).toFixed(2);

    const subtotal = parseFloat(roomTotal) + parseFloat(serviceFee);
    const taxAmount = (subtotal * 0.1).toFixed(2);

    const roomImage =
      room.imageUrls && room.imageUrls.length > 0
        ? room.imageUrls[0]
        : "https://via.placeholder.com/600x400?text=No+Image+Available";

    const templateData = {
      guest_name: user.name,
      booking_id: booking._id,
      hotel_name: hotel.name,
      room_type: room.name,
      check_in_date: formattedStartDate,
      check_out_date: formattedEndDate,
      nights: booking.totalDays,
      guests: 2,
      invoice_number: `INV-${booking.transactionId.substring(0, 8)}`,
      invoice_date: issueDate,
      price_per_night: pricePerNight,
      room_total: roomTotal,
      service_fee: serviceFee,
      tax_amount: taxAmount,
      total_amount: booking.totalAmount.toFixed(2),
      payment_method: booking.paymentMethod,
      transaction_id: booking.transactionId,
      booking_status: booking.status,
      payment_status: booking.status === "booked" ? "Booked" : booking.status,
      booking_management_url: `${process.env.FRONTEND_URL}/booking-details/${booking._id}`,
      unsubscribe_url: `${process.env.FRONTEND_URL}/unsubscribe`,
      privacy_policy_url: `${process.env.FRONTEND_URL}/privacy-policy`,

      imageUrls: {
        logo: room.imageUrls[0],
        room: roomImage,
      },

      booking: {
        hotelData: {
          ...hotel,
          name: room.name,
          address: room.address,
          city: room.city,
          state: room.state,
          country: room.country,
        },
      },
    };

    const msg = {
      to: user.email,
      from: "appbooking6@gmail.com",
      subject: `Booking Confirmation - #${booking._id}`,
      templateId: "d-d8a96e3b3949429ca80c2ceb56251272",
      dynamicTemplateData: templateData,
    };

    await sgMail.send(msg);
    console.log(`Booking confirmation email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error("SendGrid email error:", error);

    if (error.response) {
      console.error("Error details:", error.response.body);
    }

    console.log("Error  :", error);
  }
};

const sendMailSendgrid = async ({
  email,
  subject,
  templateData,
  templateId,
  booking = null,
  room = null,
  user = null,
}) => {
  try {
    if (booking && room && user) {
      return await sendBookingConfirmationEmail(booking, room, user);
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "appbooking6@gmail.com",
      subject: subject,
      templateId: templateId || process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: templateData || {},
    };

    await sgMail.send(msg);
    console.log("Email sent successfully using SendGrid template");
    return { success: true };
  } catch (error) {
    console.error("SendGrid email error:", error);

    if (error.response) {
      console.error("Error details:", error.response.body);
    }

    console.log("Error  :", error);
  }
};

module.exports = {
  sendMailSendgrid,
  sendBookingConfirmationEmail,
};
