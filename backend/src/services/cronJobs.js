const cron = require('node-cron');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { abandonedCartEmail } = require('../utils/emailTemplates');
const logger = require('../config/logger');

// Send abandoned cart emails daily at 10 AM
const abandonedCartEmailJob = cron.schedule('0 10 * * *', async () => {
  try {
    logger.info('Starting abandoned cart email job...');

    // Find carts that:
    // 1. Have items
    // 2. Haven't been updated in the last 24 hours
    // 3. User hasn't received an email in the last 7 days
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const abandonedCarts = await Cart.find({
      'items.0': { $exists: true }, // Has at least one item
      updatedAt: { $lt: oneDayAgo }, // Not updated in last 24 hours
      $or: [
        { lastAbandonedEmailSent: { $exists: false } }, // Never sent
        { lastAbandonedEmailSent: { $lt: sevenDaysAgo } } // Last sent over 7 days ago
      ]
    }).populate({
      path: 'user',
      select: 'name email'
    }).populate({
      path: 'items.product',
      select: 'name price images'
    });

    logger.info(`Found ${abandonedCarts.length} abandoned carts`);

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const cart of abandonedCarts) {
      if (!cart.user || !cart.user.email) {
        continue;
      }

      try {
        const emailContent = abandonedCartEmail(cart.user, cart);

        await sendEmail({
          to: cart.user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        });

        // Update last email sent timestamp
        cart.lastAbandonedEmailSent = new Date();
        await cart.save();

        emailsSent++;
        logger.info(`Abandoned cart email sent to ${cart.user.email}`);
      } catch (emailError) {
        emailsFailed++;
        logger.error(`Failed to send abandoned cart email to ${cart.user.email}: ${emailError.message}`);
      }
    }

    logger.info(`Abandoned cart email job completed. Sent: ${emailsSent}, Failed: ${emailsFailed}`);
  } catch (error) {
    logger.error(`Abandoned cart email job error: ${error.message}`);
  }
}, {
  scheduled: false // Don't start automatically
});

// Clean up expired coupons daily at midnight
const expiredCouponsCleanupJob = cron.schedule('0 0 * * *', async () => {
  try {
    const Coupon = require('../models/Coupon');
    logger.info('Starting expired coupons cleanup job...');

    const result = await Coupon.updateMany(
      {
        isActive: true,
        endDate: { $lt: new Date() }
      },
      {
        $set: { isActive: false }
      }
    );

    logger.info(`Expired coupons cleanup completed. Deactivated: ${result.modifiedCount} coupons`);
  } catch (error) {
    logger.error(`Expired coupons cleanup error: ${error.message}`);
  }
}, {
  scheduled: false
});

// Start all cron jobs
const startCronJobs = () => {
  logger.info('Starting cron jobs...');

  abandonedCartEmailJob.start();
  logger.info('✓ Abandoned cart email job started (runs daily at 10 AM)');

  expiredCouponsCleanupJob.start();
  logger.info('✓ Expired coupons cleanup job started (runs daily at midnight)');
};

// Stop all cron jobs
const stopCronJobs = () => {
  logger.info('Stopping cron jobs...');
  abandonedCartEmailJob.stop();
  expiredCouponsCleanupJob.stop();
};

module.exports = {
  startCronJobs,
  stopCronJobs
};
