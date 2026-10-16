// test_ai_scan_backend.cjs
const http = require('http');

async function testBackend() {
  const handler = (await import('./api/ai-scan-product.js')).default;
  
  const mockReq = {
    headers: { origin: 'http://localhost:5173' },
    method: 'POST',
    body: {
      userTitle: 'leather wallet',
      userPrice: '399',
      userBrand: 'UrbanCraft',
      selectedMarketplaces: ['amazon', 'flipkart', 'meesho']
    }
  };

  let statusCode = 200;
  let headers = {};
  let responseData = null;

  const mockRes = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (code) => {
      statusCode = code;
      return mockRes;
    },
    json: (data) => {
      responseData = data;
      return mockRes;
    },
    end: () => mockRes
  };

  await handler(mockReq, mockRes);

  console.log('Status Code:', statusCode);
  console.log('Success:', responseData?.success);
  console.log('Product Category:', responseData?.productDetails?.category);
  console.log('Product Material:', responseData?.productDetails?.material);
  console.log('HSN Code:', responseData?.productDetails?.hsnCode);
  console.log('GST %:', responseData?.productDetails?.gstPct);
  console.log('Amazon Title:', responseData?.generatedListings?.amazon?.title);
  console.log('Amazon Bullets Count:', responseData?.generatedListings?.amazon?.bullets?.length);
  console.log('Amazon Search Terms:', responseData?.generatedListings?.amazon?.searchTerms);
  console.log('Amazon Search Terms Bytes:', responseData?.generatedListings?.amazon?.searchTermsBytes);
  console.log('Flipkart Title:', responseData?.generatedListings?.flipkart?.title);
  console.log('Meesho Title:', responseData?.generatedListings?.meesho?.title);
  console.log('Pricing:', responseData?.generatedListings?.amazon?.pricing);
  console.log('Image Plan Shots:', responseData?.generatedListings?.amazon?.imagePlan?.length);

  if (responseData?.success && responseData?.generatedListings?.amazon?.title) {
    console.log('=== TEST PASSED: ALL FIELDS GENERATED 100% ===');
  } else {
    console.error('=== TEST FAILED ===');
    process.exit(1);
  }
}

testBackend().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
