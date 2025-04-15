const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  // Only allow GET requests (for link clicks from email)
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const params = event.queryStringParameters;
    const { orderId, token, status } = params;
    
    // Basic validation
    if (!orderId || !token || !status) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Error</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
              .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Error</h2>
              </div>
              <div style="padding: 20px;">
                <p>Missing required parameters. Please check the link and try again.</p>
                <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Validate the token (simple implementation)
    const expectedToken = Buffer.from(`order-${orderId}-${process.env.ORDER_SECRET_KEY || 'nandos-secret'}`).toString('base64');
    
    if (token !== expectedToken) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Access Denied</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
              .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Access Denied</h2>
              </div>
              <div style="padding: 20px;">
                <p>Invalid token. You are not authorized to perform this action.</p>
                <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Validate status
    const validStatuses = ['Processing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invalid Status</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
              .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Invalid Status</h2>
              </div>
              <div style="padding: 20px;">
                <p>The provided status is not valid. Please try again.</p>
                <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Update order status in Firestore using Admin SDK
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Order Not Found</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
              .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Order Not Found</h2>
              </div>
              <div style="padding: 20px;">
                <p>The specified order could not be found.</p>
                <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    // Update the order with Admin SDK
    await orderRef.update({
      status: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Return success page with HTML
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Order Status Updated</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #e67e22; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
            .success { color: #4CAF50; font-weight: bold; }
            .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nando's Restaurant</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
              <h2 class="success">Success!</h2>
              <p>The order #${orderId.slice(-6).toUpperCase()} status has been updated to:</p>
              <h3 style="color: ${
                status === 'Delivered' ? '#4CAF50' : 
                status === 'Cancelled' ? '#f44336' : 
                '#2196F3'
              };">${status}</h3>
              <p>The customer will be able to see this updated status when they check their order.</p>
              <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #f44336; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
            .btn { display: inline-block; padding: 8px 16px; margin: 10px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Server Error</h2>
            </div>
            <div style="padding: 20px;">
              <p>Something went wrong while updating the order status.</p>
              <p>Error details: ${error.message}</p>
              <a href="https://nandos-restaurant.netlify.app" class="btn">Go to Homepage</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};