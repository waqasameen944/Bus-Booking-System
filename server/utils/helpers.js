import nodemailer from "nodemailer";

// Generate unique booking code
export function generateBookingCode() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `BUS${timestamp}${random}`;
}

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send confirmation email to user
export async function sendConfirmationEmail(booking) {
  try {
    const transporter = createEmailTransporter();

    const timeSlotLabels = {
      morning: "Morning (08:00 AM)",
      noon: "Noon (12:00 PM)",
      evening: "Evening (06:00 PM)",
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@expressbus.com",
      to: booking.passenger.email,
      subject: `Bus Booking Confirmation - ${booking.bookingCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .booking-code { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; padding: 15px; background-color: #eff6ff; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚌 Express Bus Service</h1>
              <h2>Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear ${booking.passenger.name},</p>
              
              <p>Your bus booking has been confirmed! Here are your booking details:</p>
              
              <div class="booking-code">
                Booking Code: ${booking.bookingCode}
              </div>
              
              <div class="booking-details">
                <h3>Trip Details</h3>
                <p><strong>Date:</strong> ${booking.date.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</p>
                <p><strong>Time:</strong> ${
                  timeSlotLabels[booking.timeSlot]
                }</p>
                <p><strong>Seat Number:</strong> ${booking.seatNumber}</p>
                <p><strong>Passenger:</strong> ${booking.passenger.name}</p>
                <p><strong>Phone:</strong> ${booking.passenger.phone}</p>
                <p><strong>Amount Paid:</strong> $${booking.amount.toFixed(
                  2
                )}</p>
              </div>
              
              <div class="booking-details">
                <h3>Important Information</h3>
                <ul>
                  <li>Please arrive at the bus station 15 minutes before departure</li>
                  <li>Bring a valid ID for verification</li>
                  <li>Keep your booking code handy</li>
                  <li>Cancellations are allowed up to 24 hours before travel</li>
                </ul>
              </div>
              
              <p>Thank you for choosing Express Bus Service!</p>
            </div>
            
            <div class="footer">
              <p>Need help? Contact us at support@expressbus.com or call +1 (555) 123-4567</p>
              <p>Express Bus Service - Your Comfort, Our Priority</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${booking.passenger.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

// Send notification email to admin
export async function sendAdminNotification(booking) {
  try {
    const transporter = createEmailTransporter();

    const timeSlotLabels = {
      morning: "Morning (08:00 AM)",
      noon: "Noon (12:00 PM)",
      evening: "Evening (06:00 PM)",
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@expressbus.com",
      to: process.env.ADMIN_EMAIL || "waqasameen944@gmail.com",
      subject: `New Bus Booking - ${booking.bookingCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f0fdf4; }
            .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚌 New Booking Alert</h1>
            </div>
            
            <div class="content">
              <p>A new bus booking has been confirmed:</p>
              
              <div class="booking-details">
                <h3>Booking Information</h3>
                <p><strong>Booking Code:</strong> ${booking.bookingCode}</p>
                <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
                <p><strong>Time Slot:</strong> ${
                  timeSlotLabels[booking.timeSlot]
                }</p>
                <p><strong>Seat Number:</strong> ${booking.seatNumber}</p>
                <p><strong>Amount:</strong> $${booking.amount.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
              </div>
              
              <div class="booking-details">
                <h3>Passenger Information</h3>
                <p><strong>Name:</strong> ${booking.passenger.name}</p>
                <p><strong>Email:</strong> ${booking.passenger.email}</p>
                <p><strong>Phone:</strong> ${booking.passenger.phone}</p>
              </div>
              
              <p><strong>Booking Time:</strong> ${booking.createdAt.toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent");
  } catch (error) {
    console.error("Error sending admin notification:", error);
    throw error;
  }
}
