import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | Samrat Agencies"
        description="Privacy Policy for Samrat Agencies - Learn how we collect, use, and protect your personal information"
        canonical="/privacy-policy"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#895F42' }}>Privacy Policy</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Introduction</h2>
            <p className="mb-4">
              At Samrat Agencies, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Information We Collect</h2>
            <p className="mb-2">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders, products, and services</li>
              <li>Improve our website and customer service</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Payment processors to handle transactions securely</li>
              <li>Shipping partners to deliver your orders</li>
              <li>Law enforcement or regulatory authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Cookies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#1F2D38' }}>Contact Us</h2>
            <p className="mb-2">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="ml-4 mt-3">
              <p><strong>Samrat Agencies</strong></p>
              <p>Babu Reddy Complex, 5, Begur Main Road, Hongasandra</p>
              <p>Bommanahalli, Bengaluru, Karnataka 560114</p>
              <p className="mt-2">Phone: +91 98809 14457 / +91 94492 70486</p>
            </div>
          </section>

          <p className="text-sm text-gray-500 mt-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
