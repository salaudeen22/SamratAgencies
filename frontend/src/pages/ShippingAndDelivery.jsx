import SEO from '../components/SEO';

const ShippingAndDelivery = () => {
  return (
    <>
      <SEO
        title="Shipping and Delivery | Samrat Agencies"
        description="Shipping and Delivery Policy for Samrat Agencies - Learn about our delivery process, timelines, and charges"
        canonical="/shipping-and-delivery"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#816047' }}>Shipping and Delivery Policy</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Delivery Areas</h2>
            <p className="mb-4">
              We currently deliver to Bangalore and surrounding areas. For deliveries outside Bangalore, please contact us to check availability and shipping charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Delivery Timelines</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#816047' }}>Furniture Products</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>In-Stock Items:</strong> Delivery within 3-7 business days from order confirmation</li>
                <li><strong>Made-to-Order Items:</strong> Delivery within 15-30 business days depending on customization requirements</li>
                <li><strong>Custom Designs:</strong> Timeline will be communicated at the time of order confirmation</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#816047' }}>Samsung Electronics</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>In-Stock Items:</strong> Delivery within 2-5 business days from order confirmation</li>
                <li><strong>Special Orders:</strong> Delivery timeline will be communicated at the time of booking</li>
              </ul>
            </div>
            <p className="mt-4 text-sm italic">
              Note: Delivery timelines are estimates and may vary based on product availability, location, and other factors. We will keep you informed of any delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Shipping Charges</h2>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Within Bangalore City Limits:</strong> Shipping charges vary based on product size and weight. Charges will be displayed at checkout.</li>
              <li><strong>Outside Bangalore:</strong> Shipping charges will be calculated based on distance and product specifications.</li>
              <li><strong>Bulk Orders:</strong> Special shipping rates may apply. Please contact us for a quote.</li>
              <li><strong>Free Delivery:</strong> May be available on select products or orders above a certain value. Check product pages for details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Order Processing</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li><strong>Order Confirmation:</strong> You will receive an order confirmation email/SMS within 24 hours of placing your order</li>
              <li><strong>Order Preparation:</strong> Your order will be prepared and quality-checked before dispatch</li>
              <li><strong>Dispatch Notification:</strong> You will be notified when your order is dispatched with tracking details (if applicable)</li>
              <li><strong>Delivery Scheduling:</strong> Our delivery team will contact you to schedule a convenient delivery time</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Delivery Process</h2>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Our delivery team will contact you 24-48 hours before delivery to confirm the schedule</li>
              <li>Please ensure someone is available at the delivery address to receive the order</li>
              <li>For furniture, our team will deliver to the ground floor. Additional charges may apply for carrying items to upper floors without elevator access</li>
              <li>Basic unpacking and placement assistance is provided for furniture items</li>
              <li>Assembly services are available at additional charges (where applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Installation Services</h2>
            <p className="mb-2">
              For Samsung electronics and certain furniture items, we offer installation services:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Samsung Products:</strong> Free installation is provided by authorized Samsung technicians (as per manufacturer's policy)</li>
              <li><strong>Furniture Assembly:</strong> Available at additional charges for modular and flat-pack furniture</li>
              <li>Installation will be scheduled based on product availability and technician availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Delivery Inspection</h2>
            <p className="mb-2">
              Upon delivery, please:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Inspect the product for any visible damage or defects</li>
              <li>Check that all items and accessories mentioned in the invoice are received</li>
              <li>Report any issues immediately to our delivery team</li>
              <li>Sign the delivery receipt only after inspection</li>
              <li>Note any damages or missing items on the delivery receipt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Failed Delivery Attempts</h2>
            <p className="mb-4">
              If delivery cannot be completed due to the following reasons, the order may be returned to our warehouse:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>No one available at the delivery address</li>
              <li>Incorrect or incomplete address provided</li>
              <li>Refusal to accept delivery</li>
              <li>Multiple failed delivery attempts (typically 2-3 attempts)</li>
            </ul>
            <p className="mt-3">
              Re-delivery charges may apply for rescheduled deliveries. Please ensure you provide accurate delivery information and are available during the scheduled delivery window.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Track Your Order</h2>
            <p className="mb-4">
              You can track your order status by:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Logging into your account on our website</li>
              <li>Using the tracking link sent via email/SMS</li>
              <li>Contacting our customer service team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Damaged or Defective Products</h2>
            <p className="mb-4">
              If you receive a damaged or defective product, please:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Report the issue within 24 hours of delivery</li>
              <li>Provide photos of the damage/defect</li>
              <li>Contact our customer service team immediately</li>
              <li>Do not use or install the damaged product</li>
            </ul>
            <p className="mt-3">
              We will arrange for a replacement or refund as per our Cancellation & Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Force Majeure</h2>
            <p className="mb-4">
              Samrat Agencies shall not be liable for any delay or failure in delivery due to circumstances beyond our reasonable control, including but not limited to natural disasters, strikes, government restrictions, or other force majeure events.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>Contact Us</h2>
            <p className="mb-2">
              For any questions about shipping and delivery, please contact us:
            </p>
            <div className="ml-4 mt-3">
              <p><strong>Samrat Agencies</strong></p>
              <p>Babu Reddy Complex, 5, Begur Main Road, Hongasandra</p>
              <p>Bommanahalli, Bengaluru, Karnataka 560114</p>
              <p className="mt-2">Phone: +91 98809 14457 / +91 94492 70486</p>
              <p>Hours: Mon-Sun 8:00 AM - 10:30 PM</p>
            </div>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </>
  );
};

export default ShippingAndDelivery;
