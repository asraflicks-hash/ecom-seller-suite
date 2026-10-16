fetch('https://www.sellersuitepro.online/?_cb=' + Date.now())
  .then(res => res.text())
  .then(html => {
    console.log('=== RAW EVIDENCE: LIVE HEAD SECTION ===');
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) console.log(headMatch[1].trim());

    console.log('\n=== RAW EVIDENCE: LIVE FOOTER SECTION ===');
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    if (footerMatch) console.log(footerMatch[0].trim());

    console.log('\n=== RAW EVIDENCE: STRING AUDIT ON LIVE HTML ===');
    console.log('Contains ICBM:', html.includes('ICBM'));
    console.log('Contains geo.position:', html.includes('geo.position'));
    console.log('Contains name="keywords":', html.includes('name="keywords"'));
    console.log('Contains "official formula":', html.includes('official formula'));
    console.log('Contains "suppression-free":', html.includes('suppression-free'));
    console.log('Contains "Sidra Motion" (singular without s):', /Sidra Motion\b(?!s)/.test(html));
    console.log('Contains "Sidra Motions":', html.includes('Sidra Motions'));
    console.log('Contains "Marketplace Non-Affiliation Disclaimer":', html.includes('Marketplace Non-Affiliation Disclaimer'));
  })
  .catch(console.error);
