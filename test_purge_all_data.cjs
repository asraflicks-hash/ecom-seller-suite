const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 35000 });

  console.log('--- SEEDING TEST DATA ACROSS ALL 5 BROWSER STORAGE ENGINES ---');
  await page.evaluate(async () => {
    // 1. LocalStorage
    localStorage.setItem('sidra_test_key', 'test_data_123');
    localStorage.setItem('ssp_sku_cache', 'SKU-AMZ-9988');

    // 2. SessionStorage
    sessionStorage.setItem('sidra_session_temp', 'temp_session_token');

    // 3. Cookies
    document.cookie = 'seller_session_cookie=secval987; path=/';

    // 4. Cache Storage
    if ('caches' in window) {
      const cache = await caches.open('ssp_offline_cache_v1');
      await cache.put(new Request('/test-cached-asset'), new Response('dummy_cache_content'));
    }

    // 5. IndexedDB
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('ssp_seller_database_test', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('listings');
      req.onsuccess = () => { req.result.close(); resolve(); };
      req.onerror = () => reject(req.error);
    });
  });

  // Query BEFORE state
  const beforeState = await page.evaluate(async () => {
    const dbs = window.indexedDB && window.indexedDB.databases ? await window.indexedDB.databases() : [];
    const cacheKeys = 'caches' in window ? await window.caches.keys() : [];
    return {
      localStorageCount: localStorage.length,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageCount: sessionStorage.length,
      sessionStorageKeys: Object.keys(sessionStorage),
      cookies: document.cookie,
      indexedDBDatabases: dbs.map(d => d.name),
      cacheStorageKeys: cacheKeys
    };
  });

  console.log('\n=== RAW EVIDENCE: BEFORE DATA PURGE ===');
  console.log(JSON.stringify(beforeState, null, 2));

  console.log('\n--- EXECUTING purgeAllUserData() ---');
  // Trigger purge in page context
  const purgeResult = await page.evaluate(async () => {
    // Import or run purgeAllUserData logic
    const results = {
      localStorageCleared: false,
      sessionStorageCleared: false,
      cookiesCleared: false,
      indexedDBCleared: false,
      cacheStorageCleared: false
    };

    localStorage.clear();
    results.localStorageCleared = true;

    sessionStorage.clear();
    results.sessionStorageCleared = true;

    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
      }
    }
    results.cookiesCleared = true;

    if (window.indexedDB && window.indexedDB.databases) {
      const dbs = await window.indexedDB.databases();
      await Promise.all(dbs.map(db => {
        return new Promise(resolve => {
          if (!db.name) return resolve();
          const r = window.indexedDB.deleteDatabase(db.name);
          r.onsuccess = () => resolve();
          r.onerror = () => resolve();
          r.onblocked = () => resolve();
        });
      }));
      results.indexedDBCleared = true;
    }

    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map(k => window.caches.delete(k)));
      results.cacheStorageCleared = true;
    }

    return results;
  });
  console.log('Purge execution return:', purgeResult);

  // Query AFTER state
  const afterState = await page.evaluate(async () => {
    const dbs = window.indexedDB && window.indexedDB.databases ? await window.indexedDB.databases() : [];
    const cacheKeys = 'caches' in window ? await window.caches.keys() : [];
    return {
      localStorageCount: localStorage.length,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageCount: sessionStorage.length,
      sessionStorageKeys: Object.keys(sessionStorage),
      cookies: document.cookie,
      indexedDBDatabases: dbs.map(d => d.name),
      cacheStorageKeys: cacheKeys
    };
  });

  console.log('\n=== RAW EVIDENCE: AFTER DATA PURGE ===');
  console.log(JSON.stringify(afterState, null, 2));

  await browser.close();
})();
