import handler from './api/ai-proxy.js';

function createMockReqRes({ method = 'POST', headers = {}, body = {} }) {
  const req = {
    method,
    headers: {
      origin: 'https://www.sellersuitepro.online',
      ...headers
    },
    body,
    socket: { remoteAddress: '127.0.0.1' }
  };

  const res = {
    statusCode: 200,
    headers: {},
    bodyData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
      return this;
    },
    json(data) {
      this.bodyData = data;
      return this;
    },
    end() {
      return this;
    }
  };

  return { req, res };
}

async function runTests() {
  console.log('=== TEST 1: Disallowed Origin (CORS rejection with 403) ===');
  const corsTest = createMockReqRes({
    headers: { origin: 'https://evil-hacker.com' },
    body: { prompt: 'Test product listing' }
  });
  await handler(corsTest.req, corsTest.res);
  console.log(`Status Code: ${corsTest.res.statusCode}`);
  console.log(`Response: ${JSON.stringify(corsTest.res.bodyData)}\n`);

  console.log('=== TEST 2: Payload < 3 characters (Rejection with 400) ===');
  const tooShortTest = createMockReqRes({
    body: { prompt: 'ab' }
  });
  await handler(tooShortTest.req, tooShortTest.res);
  console.log(`Status Code: ${tooShortTest.res.statusCode}`);
  console.log(`Response: ${JSON.stringify(tooShortTest.res.bodyData)}\n`);

  console.log('=== TEST 3: Payload > 2,000 characters (Rejection with 400) ===');
  const tooLongTest = createMockReqRes({
    body: { prompt: 'A'.repeat(2005) }
  });
  await handler(tooLongTest.req, tooLongTest.res);
  console.log(`Status Code: ${tooLongTest.res.statusCode}`);
  console.log(`Response: ${JSON.stringify(tooLongTest.res.bodyData)}\n`);

  console.log('=== TEST 4: Rate Limiter - 10 Allowed Requests followed by 11th Request 429 ===');
  const testIp = '198.51.100.42'; // isolated test IP
  for (let i = 1; i <= 10; i++) {
    const validTest = createMockReqRes({
      headers: { 'x-real-ip': testIp },
      body: { prompt: `Valid product query ${i}` }
    });
    await handler(validTest.req, validTest.res);
    if (i === 1 || i === 10) {
      console.log(`Request #${i} -> Status: ${validTest.res.statusCode}, Success: ${validTest.res.bodyData?.success}`);
    }
  }

  // 11th Request
  const eleventhReq = createMockReqRes({
    headers: { 'x-real-ip': testIp },
    body: { prompt: 'Eleventh request should be rate-limited' }
  });
  await handler(eleventhReq.req, eleventhReq.res);
  console.log(`Request #11 -> Status: ${eleventhReq.res.statusCode}`);
  console.log(`Response: ${JSON.stringify(eleventhReq.res.bodyData)}\n`);

  console.log('=== TEST 5: Client IP Header Priority (x-vercel-forwarded-for) ===');
  const vercelIp = '203.0.113.88';
  const vercelTest = createMockReqRes({
    headers: { 'x-vercel-forwarded-for': `${vercelIp}, 10.0.0.1` },
    body: { prompt: 'Vercel forwarded IP test' }
  });
  await handler(vercelTest.req, vercelTest.res);
  console.log(`Status Code: ${vercelTest.res.statusCode}`);
  console.log(`Success: ${vercelTest.res.bodyData?.success}, Mode: ${vercelTest.res.bodyData?.mode}`);
}

runTests().catch(err => console.error('Test execution failed:', err));
