#!/usr/bin/env node

/**
 * One-time script to submit all existing pages to IndexNow
 * Run this after deploying the IndexNow integration
 *
 * Usage: node scripts/submitAllToIndexNow.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { submitAllSiteUrls } = require('../src/utils/indexNow');
const logger = require('../src/config/logger');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  console.log('\n🚀 Starting IndexNow Bulk Submission...\n');
  console.log('📝 This will submit all existing pages to IndexNow:');
  console.log('   - Static pages (Home, About, Contact, etc.)');
  console.log('   - All active products');
  console.log('   - All active categories');
  console.log('   - All published articles');
  console.log('\n⏳ Please wait...\n');

  await connectDB();

  try {
    const result = await submitAllSiteUrls();

    console.log('\n' + '='.repeat(60));

    if (result.success) {
      console.log('✅ SUCCESS! Bulk submission completed');
      console.log('\n📊 Submission Summary:');
      console.log(`   Total URLs submitted: ${result.totalUrls}`);
      console.log(`   Batches sent: ${result.batches}`);
      console.log(`   Successful batches: ${result.results.filter(r => r.success).length}`);
      console.log(`   Failed batches: ${result.results.filter(r => !r.success).length}`);

      console.log('\n🎯 What happens next:');
      console.log('   1. Bing will receive your URLs within seconds');
      console.log('   2. Bingbot will crawl your pages within minutes to hours');
      console.log('   3. Pages will appear in Bing search within 24 hours');
      console.log('   4. Check Bing Webmaster Tools for indexing status');

      console.log('\n🔗 Useful Links:');
      console.log('   Bing Webmaster: https://www.bing.com/webmasters');
      console.log('   IndexNow Docs: https://www.indexnow.org/documentation');

    } else {
      console.log('❌ FAILED! Bulk submission failed');
      console.log('\n⚠️  Error Details:');
      console.log(`   ${result.error || 'Unknown error'}`);
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify FRONTEND_URL in .env file');
      console.log('   3. Make sure key file is accessible at:');
      console.log(`      ${process.env.FRONTEND_URL}/81f3e5e8955448008d96b009fe55e242.txt`);
    }

    console.log('='.repeat(60) + '\n');

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error during bulk submission:', error);
    console.error('\n💡 Stack trace:', error.stack);
    process.exit(1);
  }
};

// Run the script
main();
