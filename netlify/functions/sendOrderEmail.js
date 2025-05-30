const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the JSON body
    const data = JSON.parse(event.body);
    const { order, user } = data;
    
    console.log('Email function triggered with data:', {
      orderID: order.id,
      userEmail: user.email,
      userDisplayName: user.displayName
    });
    
    // Create a more secure Gmail transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Format order items for the email
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.itemName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">LKR ${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">LKR ${item.subtotal.toFixed(2)}</td>
      </tr>`
    ).join('');

    // Generate secure token for order status update
    const secretKey = process.env.ORDER_SECRET_KEY || 'nandos-secret';
    const token = Buffer.from(`order-${order.id}-${secretKey}`).toString('base64');
    
    // Base URL for the deployed Netlify site
    const baseUrl = process.env.URL || 'https://nandos-restaurant.netlify.app';
    
    // Create status update links
    const processingLink = `${baseUrl}/.netlify/functions/updateOrderStatus?orderId=${order.id}&token=${token}&status=Processing`;
    const deliveredLink = `${baseUrl}/.netlify/functions/updateOrderStatus?orderId=${order.id}&token=${token}&status=Delivered`;
    const cancelledLink = `${baseUrl}/.netlify/functions/updateOrderStatus?orderId=${order.id}&token=${token}&status=Cancelled`;

    // Create the email content
    const mailOptions = {
      from: `"Nando's Orders" <${process.env.EMAIL_USER}>`,
      to: 'rifthanfathir33@gmail.com',
      subject: `New Order #${order.id} from ${user.displayName || 'Customer'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e67e22;">New Order Received!</h2>
          <p>A new order has been placed on your website.</p>
          
          <h3>Customer Information:</h3>
          <p><strong>Name:</strong> ${user.displayName || 'Not provided'}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> ${user.address || 'Not provided'}</p>
          
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${order.id || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 8px;">LKR ${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Delivery Fee:</strong></td>
                <td style="padding: 8px;">LKR ${order.deliveryFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 8px; font-weight: bold; color: #e67e22;">LKR ${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px; padding: 20px; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #e67e22; margin-top: 0;">Update Order Status</h3>
            <p>Click one of the buttons below to update this order's status:</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${processingLink}" style="display: inline-block; margin: 5px; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Mark as Processing
              </a>
              
              <a href="${deliveredLink}" style="display: inline-block; margin: 5px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Mark as Delivered
              </a>
              
              <a href="${cancelledLink}" style="display: inline-block; margin: 5px; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Cancel Order
              </a>
            </div>
            
            <p style="margin: 0; font-size: 12px; color: #666;">These links will update the order status in your system and notify the customer.</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0;">Please process this order as soon as possible. Thank you!</p>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email to:', mailOptions.to);
    
    // Send the email with better error handling
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email sent successfully', messageId: info.messageId })
      };
    } catch (sendError) {
      console.error('Error in transporter.sendMail:', sendError);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to send email', 
          details: sendError.message,
          stack: sendError.stack 
        })
      };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request', 
        details: error.message 
      })
    };
  }
};