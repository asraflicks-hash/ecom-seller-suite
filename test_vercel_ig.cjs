// test_vercel_ig.cjs
async function test() {
  const res = await fetch('https://www.sellersuitepro.online/api/resolve-social?handle=zshuja_313&platform=instagram');
  const data = await res.json();
  console.log('zshuja_313 result:', JSON.stringify(data, null, 2));

  const res2 = await fetch('https://www.sellersuitepro.online/api/resolve-social?handle=cristiano&platform=instagram');
  const data2 = await res2.json();
  console.log('cristiano result:', JSON.stringify(data2, null, 2));

  const res3 = await fetch('https://www.sellersuitepro.online/api/resolve-social?handle=nike&platform=instagram');
  const data3 = await res3.json();
  console.log('nike result:', JSON.stringify(data3, null, 2));
}
test();
