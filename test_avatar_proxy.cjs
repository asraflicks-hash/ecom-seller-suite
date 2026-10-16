// test_avatar_proxy.cjs
const handler = require('./api/avatar-proxy.js').default || require('./api/avatar-proxy.js');

async function testProxy() {
  const cdnUrl = 'https://scontent.cdninstagram.com/v/t51.82787-19/706132788_18000769712931292_8096613048388280591_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=101&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=5fZ9FubU0_sQ7kNvwGK1ZMB&_nc_oc=AdqFTrv0TtwbPTw8eB6BiwK8vqLWQ-43TDEzrasGhXr3G93NNk_CKQDk8mES1Oe4VOGRY8gbyXxFfMAsCBMwd3vg&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=E6SqV0SfXjtVcoxFklDrgg&_nc_ss=7d689&oh=00_AQNNCmJ6JZC5VLerAT7dKS25NrLZWPzaSYnfYzk9WS5MMw&oe=6AD7BBDA';

  const req = {
    headers: { origin: 'https://www.sellersuitepro.online' },
    query: { url: cdnUrl },
    method: 'GET'
  };

  const headers = {};
  let statusCode = 200;
  let sentData = null;

  const res = {
    setHeader(k, v) { headers[k] = v; },
    status(c) { statusCode = c; return this; },
    send(d) { sentData = d; return this; },
    end() { return this; }
  };

  await handler(req, res);
  console.log('Proxy status:', statusCode);
  console.log('Headers:', headers);
  console.log('Buffer length:', sentData ? sentData.length : 0);
}

testProxy();
