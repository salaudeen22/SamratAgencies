const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generate invoice PDF for an order
 * @param {Object} order - Order object from database
 * @param {Object} res - Express response object
 */
const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

  // Pipe the PDF to response
  doc.pipe(res);

  // Header
  generateHeader(doc);

  // Invoice details
  generateInvoiceInfo(doc, order);

  // Customer details
  generateCustomerInfo(doc, order);

  // Table
  generateItemsTable(doc, order);

  // Footer
  generateFooter(doc);

  // Finalize PDF
  doc.end();
};

function generateHeader(doc) {
  // Try to add logo if it exists
  const logoPath = path.join(__dirname, '../../public/logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 50, 35, { width: 80, height: 80 });
    } catch (err) {
      console.log('Logo error, skipping:', err.message);
    }
  }

  // Company details
  doc
    .fontSize(20)
    .fillColor('#2F1A0F')
    .text('SAMRAT AGENCIES', 140, 45)
    .fontSize(10)
    .fillColor('#666666')
    .text('Since 1996', 140, 70)
    .text('Babu Reddy Complex, 5', 50, 110)
    .text('Begur Main Road, Hongasandra', 50, 125)
    .text('Bommanahalli, Bengaluru', 50, 140)
    .text('Karnataka 560114', 50, 155)
    .text('Phone: +91 98809 14457 / +91 94480 75801', 50, 170)
    .text('Email: info@samratagencies.in', 50, 185)
    .fontSize(9)
    .fillColor('#816047')
    .font('Helvetica-Bold')
    .text('GST Number: 29ADBPN9317P2ZT', 50, 200)
    .font('Helvetica')
    .moveDown();

  // INVOICE title
  doc
    .fontSize(24)
    .fillColor('#816047')
    .text('INVOICE', 400, 50, { align: 'right' });

  // Line
  doc
    .strokeColor('#816047')
    .lineWidth(2)
    .moveTo(50, 220)
    .lineTo(550, 220)
    .stroke();
}

function generateInvoiceInfo(doc, order) {
  const invoiceDate = new Date(order.createdAt);

  doc
    .fontSize(10)
    .fillColor('#666666')
    .text(`Invoice Number:`, 350, 240)
    .fillColor('#2F1A0F')
    .text(`INV-${order._id.toString().slice(-8).toUpperCase()}`, 350, 255)
    .fillColor('#666666')
    .text(`Invoice Date:`, 350, 275)
    .fillColor('#2F1A0F')
    .text(formatDate(invoiceDate), 350, 290)
    .fillColor('#666666')
    .text(`Order ID:`, 350, 310)
    .fillColor('#2F1A0F')
    .text(order._id.toString().slice(-8).toUpperCase(), 350, 325)
    .fillColor('#666666')
    .text(`Payment Method:`, 350, 345)
    .fillColor('#2F1A0F')
    .text(order.paymentMethod.toUpperCase(), 350, 360)
    .moveDown();
}

function generateCustomerInfo(doc, order) {
  doc
    .fontSize(12)
    .fillColor('#2F1A0F')
    .text('Bill To:', 50, 240)
    .fontSize(10)
    .fillColor('#666666')
    .text(order.shippingAddress.name, 50, 260)
    .text(order.shippingAddress.address, 50, 275, { width: 250 })
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 50, 300)
    .text(`${order.shippingAddress.pincode}`, 50, 315)
    .text(`Phone: ${order.shippingAddress.phone}`, 50, 330)
    .moveDown();
}

function generateItemsTable(doc, order) {
  const tableTop = 400;
  const itemCodeX = 50;
  const descriptionX = 150;
  const quantityX = 320;
  const priceX = 390;
  const amountX = 480;

  // Table header
  doc
    .fontSize(10)
    .fillColor('#ffffff')
    .rect(50, tableTop, 500, 25)
    .fill('#816047');

  doc
    .fillColor('#ffffff')
    .text('#', itemCodeX + 10, tableTop + 8)
    .text('Description', descriptionX, tableTop + 8)
    .text('Qty', quantityX, tableTop + 8)
    .text('Price', priceX, tableTop + 8)
    .text('Amount', amountX, tableTop + 8);

  // Table rows
  let position = tableTop + 30;
  let rowColor = true;

  order.items.forEach((item, index) => {
    const variants = item.selectedVariants && item.selectedVariants.size > 0
      ? Array.from(item.selectedVariants.entries()).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '';

    const description = variants ? `${item.name}\n(${variants})` : item.name;
    const lineHeight = variants ? 30 : 20;

    // Alternating row colors
    if (rowColor) {
      doc
        .rect(50, position - 5, 500, lineHeight)
        .fill('#f8f9fa');
    }

    doc
      .fillColor('#2F1A0F')
      .fontSize(9)
      .text(index + 1, itemCodeX + 10, position)
      .text(description, descriptionX, position, { width: 150 })
      .text(item.quantity, quantityX, position)
      .text(`Rs. ${item.price.toLocaleString('en-IN')}`, priceX, position)
      .text(`Rs. ${(item.quantity * item.price).toLocaleString('en-IN')}`, amountX, position);

    position += lineHeight;
    rowColor = !rowColor;
  });

  // Summary section
  const summaryTop = position + 20;

  doc
    .fontSize(10)
    .fillColor('#666666')
    .text('Subtotal:', 380, summaryTop)
    .fillColor('#2F1A0F')
    .text(`Rs. ${order.itemsPrice.toLocaleString('en-IN')}`, 480, summaryTop);

  if (order.discount > 0) {
    doc
      .fillColor('#666666')
      .text('Discount:', 380, summaryTop + 20)
      .fillColor('#2F1A0F')
      .text(`-Rs. ${order.discount.toLocaleString('en-IN')}`, 480, summaryTop + 20);
  }

  doc
    .fillColor('#666666')
    .text('Shipping:', 380, summaryTop + (order.discount > 0 ? 40 : 20))
    .fillColor('#2F1A0F')
    .text(`Rs. ${order.shippingPrice.toLocaleString('en-IN')}`, 480, summaryTop + (order.discount > 0 ? 40 : 20));

  doc
    .fillColor('#666666')
    .text('Tax (GST):', 380, summaryTop + (order.discount > 0 ? 60 : 40))
    .fillColor('#2F1A0F')
    .text(`Rs. ${order.taxPrice.toLocaleString('en-IN')}`, 480, summaryTop + (order.discount > 0 ? 60 : 40));

  // Total
  const totalTop = summaryTop + (order.discount > 0 ? 85 : 65);
  doc
    .strokeColor('#816047')
    .lineWidth(1)
    .moveTo(380, totalTop)
    .lineTo(550, totalTop)
    .stroke();

  doc
    .fontSize(12)
    .fillColor('#2F1A0F')
    .font('Helvetica-Bold')
    .text('TOTAL:', 380, totalTop + 10)
    .fontSize(14)
    .text(`Rs. ${order.totalPrice.toLocaleString('en-IN')}`, 480, totalTop + 10);

  doc.font('Helvetica');
}

function generateFooter(doc) {
  doc
    .fontSize(8)
    .fillColor('#999999')
    .text(
      'Thank you for your business!',
      50,
      730,
      { align: 'center', width: 500 }
    )
    .text(
      'For any queries, please contact us at +91 98809 14457 or info@samratagencies.in',
      50,
      745,
      { align: 'center', width: 500 }
    )
    .text(
      'www.samratagencies.in',
      50,
      760,
      { align: 'center', width: 500 }
    );
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

module.exports = { generateInvoice };
