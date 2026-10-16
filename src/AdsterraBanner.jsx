import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Official 728x90 Banner Component
 * Key: c5c1c14e955208e66039c002098c5aad
 * Hosted inside an isolated iframe to guarantee reliable React execution
 * and prevent script clobbering or DOM conflicts.
 */
export default function AdsterraBanner({ className = '', style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous renders
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.style.width = '728px';
    iframe.style.height = '90px';
    iframe.style.maxWidth = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('title', 'Adsterra Premium Ad');

    container.appendChild(iframe);

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : 'c5c1c14e955208e66039c002098c5aad',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  <\/script>
  <script type="text/javascript" src="https://bauval.org/22/c5c1c14e955208e66039c002098c5aad"><\/script>
</body>
</html>`);
        doc.close();
      }
    } catch (e) {
      console.warn('Adsterra iframe initialization error:', e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`adsterra-banner-wrapper ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '90px',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    />
  );
}
