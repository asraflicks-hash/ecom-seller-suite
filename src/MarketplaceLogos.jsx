import React from 'react';

// Official Amazon Logo (Dark tile with iconic white 'a' and vibrant orange smile arrow)
export function AmazonLogo({ size = 18, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: '4px' }}
    >
      <rect width="24" height="24" rx="5" fill="#131921" />
      {/* Amazon letter 'a' */}
      <path 
        d="M13.2 13.8c-.5.4-1.2.6-1.8.6-.9 0-1.5-.4-1.5-1.2 0-.6.4-1.1 1.2-1.2l2.1-.3v2.1zm2.3 2.1h-1.3v-.8c-.7.6-1.6.9-2.5.9-1.6 0-2.6-.9-2.6-2.2 0-1.4 1-2.1 2.7-2.3l2.4-.3v-.5c0-.8-.5-1.2-1.5-1.2-.8 0-1.5.3-2 .8l-.9-.9c.8-.8 1.8-1.1 3-1.1 2.1 0 3 1 3 2.6v5z" 
        fill="#FFFFFF" 
      />
      {/* Iconic curved smile arrow */}
      <path 
        d="M6.5 17.5c2.4 1.5 5.5 1.7 8.2.8.4-.1.8.3.5.7-1.4 1.1-4.2 1.8-7.2 1-.4-.1-.5-.5-.1-.7z" 
        fill="#FF9900" 
      />
      <path 
        d="M14.5 17.8c.3-.3.9-.4 1.5-.3.2 0 .2.2.1.3-.6.5-1.4.9-2.2 1-.1 0-.2-.1-.1-.3.2-.2.5-.5.7-.7z" 
        fill="#FF9900" 
      />
    </svg>
  );
}

// Official Flipkart Logo (Blue tile with yellow bag and blue italic 'f')
export function FlipkartLogo({ size = 18, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: '4px' }}
    >
      <rect width="24" height="24" rx="5" fill="#2874F0" />
      {/* Shopping bag handle */}
      <path d="M10 7.5V6a2 2 0 0 1 4 0v1.5" stroke="#FFE11B" strokeWidth="1.8" strokeLinecap="round" />
      {/* Yellow shopping bag */}
      <path d="M6.5 8.5h11l-1.3 10.8a1.2 1.2 0 0 1-1.2 1H9a1.2 1.2 0 0 1-1.2-1L6.5 8.5z" fill="#FFE11B" />
      {/* Flipkart italic 'f' */}
      <path 
        d="M13.2 11c-.7 0-1.2.3-1.4.9h1.7v1h-1.7v4.6h-1.3v-4.6h-.9v-1h.9v-.5c0-1.3.8-2 2.1-2 .7 0 1.2.2 1.5.3l-.3 1c-.2-.1-.5-.2-.9-.2z" 
        fill="#2874F0" 
      />
    </svg>
  );
}

// Official Meesho Logo (Vibrant Magenta tile with white looping 'm')
export function MeeshoLogo({ size = 18, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: '4px' }}
    >
      <rect width="24" height="24" rx="5" fill="#F43397" />
      {/* Meesho iconic looping 'M' */}
      <path 
        d="M6.8 16.5V9.5a1.8 1.8 0 0 1 3.6 0v4.2a1.8 1.8 0 0 1 3.6 0V9.5a1.8 1.8 0 0 1 3.6 0v7" 
        stroke="#FFFFFF" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

// Official Myntra Logo (Dark tile with multi-tone colorful ribbon 'M')
export function MyntraLogo({ size = 18, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: '4px' }}
    >
      <rect width="24" height="24" rx="5" fill="#1e293b" />
      {/* Myntra 4-ribbon M */}
      <path d="M5.5 16.5L8.5 7.5L12 13L8.5 16.5H5.5z" fill="#FF3F6C" />
      <path d="M12 13L15.5 7.5L18.5 16.5h-3l-2.2-5-1.3 1.5z" fill="#F16521" />
      <path d="M8.5 7.5L12 13l-1.8 1.8L8.5 7.5z" fill="#FF527B" />
      <path d="M15.5 7.5L12 13l1.8 1.8L15.5 7.5z" fill="#F7931E" />
    </svg>
  );
}

// Official Shopify Logo (Green tile with Shopify bag and 'S')
export function ShopifyLogo({ size = 18, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: '4px' }}
    >
      <rect width="24" height="24" rx="5" fill="#5E8E3E" />
      <path d="M10 7.5V6a2 2 0 0 1 4 0v1.5" stroke="#95BF47" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 8.5h10l-1.2 10.5a1.2 1.2 0 0 1-1.2 1H9.4a1.2 1.2 0 0 1-1.2-1L7 8.5z" fill="#95BF47" />
      <path d="M13.2 11.2c-.4-.2-.8-.3-1.3-.3-.9 0-1.4.5-1.4 1.1 0 1.2 2.2.9 2.2 2.2 0 .8-.6 1.3-1.5 1.3-.6 0-1.2-.2-1.6-.5l.3-.9c.4.2.8.4 1.3.4.8 0 1.2-.4 1.2-1 0-1.2-2.2-.9-2.2-2.2 0-.8.6-1.3 1.5-1.3.5 0 1 .1 1.4.3l-.3.9z" fill="#FFFFFF" />
    </svg>
  );
}

// Universal Logo Resolver Helper
export function MarketplaceLogo({ platform = '', size = 18, className = '' }) {
  const norm = (platform || '').toLowerCase();
  if (norm.includes('amazon')) return <AmazonLogo size={size} className={className} />;
  if (norm.includes('flipkart')) return <FlipkartLogo size={size} className={className} />;
  if (norm.includes('meesho')) return <MeeshoLogo size={size} className={className} />;
  if (norm.includes('myntra')) return <MyntraLogo size={size} className={className} />;
  if (norm.includes('shopify')) return <ShopifyLogo size={size} className={className} />;
  return null;
}
