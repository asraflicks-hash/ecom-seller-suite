// test_ig_cdn_image.cjs
async function testCdn() {
  const imgUrl = 'https://scontent.cdninstagram.com/v/t51.82787-19/706132788_18000769712931292_8094246872583802951_n.jpg?_nc_cat=103&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=2XyJ3t_jU2cQ7kNvwG54f4Z&_nc_oc=AdrfR0g5E9wzH-qC17G2Y7K2YwM&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=0&oh=00_AYB...';
  
  // Test with no referer
  const res = await fetch('https://scontent.cdninstagram.com/v/t51.82787-19/706132788_18000769712931292_8094246872583802951_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent.cdninstagram.com&_nc_cat=103', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('CDN status with no referer:', res.status);
}
testCdn();
