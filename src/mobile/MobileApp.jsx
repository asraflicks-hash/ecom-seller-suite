// src/mobile/MobileApp.jsx - Master Native Mobile Shell
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Home, 
  FileText, 
  Image as ImageIcon, 
  Calculator, 
  MoreHorizontal,
  X,
  ExternalLink,
  Trash2,
  ShoppingBag,
  Info
} from 'lucide-react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

import MobileHome from './MobileHome.jsx';
import MobileListing from './MobileListing.jsx';
import MobileStudio from './MobileStudio.jsx';
import MobileProfit from './MobileProfit.jsx';
import MobileMore from './MobileMore.jsx';
import MobileMarketplaceSheet from './MobileMarketplaceSheet.jsx';
import CreateListingWizardModal from '../CreateListingWizard/CreateListingWizardModal.jsx';
import { useMobileMotion } from './useMobileMotion.js';
import './mobile.css';

export default function MobileApp({ onSwitchToDesktop }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSegment, setActiveSegment] = useState(null);
  const [activeMarketplace, setActiveMarketplace] = useState(() => {
    try {
      return localStorage.getItem('ssp_active_marketplace') || 'amazon';
    } catch {
      return 'amazon';
    }
  });

  const [isMarketplaceSheetOpen, setIsMarketplaceSheetOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const backPressCountRef = useRef(0);
  const backPressTimerRef = useRef(null);

  const { motionMode, setMotionMode, triggerHaptic } = useMobileMotion();

  // Show Toast Snackbar Helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Update Marketplace
  const handleSelectMarketplace = (mpId) => {
    setActiveMarketplace(mpId);
    try {
      localStorage.setItem('ssp_active_marketplace', mpId);
    } catch (e) {
      console.warn('Failed to save marketplace:', e);
    }
  };

  // Navigate Tab with optional segment
  const handleNavigateTab = (tab, segment = null) => {
    if (triggerHaptic) triggerHaptic('light');
    setActiveTab(tab);
    if (segment) {
      setActiveSegment(segment);
    }
  };

  // Configure Capacitor Status Bar on Mount
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const configureStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0c182e' });
      } catch (err) {
        console.warn('StatusBar configuration notice:', err);
      }
    };
    configureStatusBar();
  }, []);

  // Listen to Keyboard visibility to hide bottom nav when typing
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let showSub = null;
    let hideSub = null;

    const setupKeyboard = async () => {
      try {
        showSub = await Keyboard.addListener('keyboardWillShow', () => {
          setIsKeyboardVisible(true);
        });
        hideSub = await Keyboard.addListener('keyboardWillHide', () => {
          setIsKeyboardVisible(false);
        });
      } catch (err) {
        console.warn('Keyboard listener error:', err);
      }
    };
    setupKeyboard();

    return () => {
      if (showSub && showSub.remove) showSub.remove();
      if (hideSub && hideSub.remove) hideSub.remove();
    };
  }, []);

  // Android Hardware Back Button Priority Stack
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backListener = null;
    const setupBack = async () => {
      try {
        backListener = await App.addListener('backButton', () => {
          // Priority 1: Close active bottom sheet or overflow menu
          if (isMarketplaceSheetOpen) {
            setIsMarketplaceSheetOpen(false);
            return;
          }
          if (isOverflowOpen) {
            setIsOverflowOpen(false);
            return;
          }

          // Priority 2: If on any screen other than Home, navigate back to Home
          if (activeTab !== 'home') {
            setActiveTab('home');
            return;
          }

          // Priority 3: On Home screen, prompt double-tap to exit
          if (backPressCountRef.current === 0) {
            backPressCountRef.current = 1;
            showToast('Press back again to exit');
            if (triggerHaptic) triggerHaptic('light');

            backPressTimerRef.current = setTimeout(() => {
              backPressCountRef.current = 0;
            }, 2000);
          } else {
            // Second press within 2000ms -> Exit App
            if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
            App.exitApp();
          }
        });
      } catch (err) {
        console.warn('Back button listener error:', err);
      }
    };
    setupBack();

    return () => {
      if (backListener && backListener.remove) backListener.remove();
      if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
    };
  }, [activeTab, isMarketplaceSheetOpen, isOverflowOpen, showToast, triggerHaptic]);

  return (
    <div className="mobile-shell-root">
      {/* Active Screen View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {activeTab === 'home' && (
          <MobileHome
            activeMarketplace={activeMarketplace}
            onOpenMarketplaceSheet={() => setIsMarketplaceSheetOpen(true)}
            onOpenOverflow={() => setIsOverflowOpen(true)}
            onNavigateTab={handleNavigateTab}
            triggerHaptic={triggerHaptic}
            onOpenCreateListingWizard={() => setIsCreateWizardOpen(true)}
          />
        )}

        {activeTab === 'listing' && (
          <MobileListing
            activeMarketplace={activeMarketplace}
            initialSegment={activeSegment}
            onOpenMarketplaceSheet={() => setIsMarketplaceSheetOpen(true)}
            onOpenOverflow={() => setIsOverflowOpen(true)}
            triggerHaptic={triggerHaptic}
          />
        )}

        {activeTab === 'studio' && (
          <MobileStudio
            activeMarketplace={activeMarketplace}
            onOpenMarketplaceSheet={() => setIsMarketplaceSheetOpen(true)}
            onOpenOverflow={() => setIsOverflowOpen(true)}
            triggerHaptic={triggerHaptic}
          />
        )}

        {activeTab === 'profit' && (
          <MobileProfit
            activeMarketplace={activeMarketplace}
            initialSegment={activeSegment}
            onOpenMarketplaceSheet={() => setIsMarketplaceSheetOpen(true)}
            onOpenOverflow={() => setIsOverflowOpen(true)}
            triggerHaptic={triggerHaptic}
          />
        )}

        {activeTab === 'more' && (
          <MobileMore
            activeMarketplace={activeMarketplace}
            onOpenMarketplaceSheet={() => setIsMarketplaceSheetOpen(true)}
            onOpenOverflow={() => setIsOverflowOpen(true)}
            motionMode={motionMode}
            setMotionMode={setMotionMode}
            triggerHaptic={triggerHaptic}
            showToast={showToast}
            onSwitchToDesktop={onSwitchToDesktop}
          />
        )}
      </div>

      {/* Bottom Navigation Bar (64dp, Mockup Parity) */}
      <nav 
        className={`mobile-bottom-nav ${isKeyboardVisible ? 'nav-hidden' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Tab 1: Home */}
        <button
          className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigateTab('home')}
          role="tab"
          aria-selected={activeTab === 'home'}
        >
          {activeTab === 'home' && <div className="mobile-nav-indicator" />}
          <Home size={20} />
          <span>Home</span>
        </button>

        {/* Tab 2: Listing */}
        <button
          className={`mobile-nav-item ${activeTab === 'listing' ? 'active' : ''}`}
          onClick={() => handleNavigateTab('listing', 'optimizer')}
          role="tab"
          aria-selected={activeTab === 'listing'}
        >
          {activeTab === 'listing' && <div className="mobile-nav-indicator" />}
          <FileText size={20} />
          <span>Listing</span>
        </button>

        {/* Tab 3: Studio */}
        <button
          className={`mobile-nav-item ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => handleNavigateTab('studio')}
          role="tab"
          aria-selected={activeTab === 'studio'}
        >
          {activeTab === 'studio' && <div className="mobile-nav-indicator" />}
          <ImageIcon size={20} />
          <span>Studio</span>
        </button>

        {/* Tab 4: Profit */}
        <button
          className={`mobile-nav-item ${activeTab === 'profit' ? 'active' : ''}`}
          onClick={() => handleNavigateTab('profit', 'rto')}
          role="tab"
          aria-selected={activeTab === 'profit'}
        >
          {activeTab === 'profit' && <div className="mobile-nav-indicator" />}
          <Calculator size={20} />
          <span>Profit</span>
        </button>

        {/* Tab 5: More */}
        <button
          className={`mobile-nav-item ${activeTab === 'more' ? 'active' : ''}`}
          onClick={() => handleNavigateTab('more')}
          role="tab"
          aria-selected={activeTab === 'more'}
        >
          {activeTab === 'more' && <div className="mobile-nav-indicator" />}
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Marketplace Selector Bottom Sheet */}
      <MobileMarketplaceSheet
        isOpen={isMarketplaceSheetOpen}
        onClose={() => setIsMarketplaceSheetOpen(false)}
        activeMarketplace={activeMarketplace}
        onSelect={handleSelectMarketplace}
        triggerHaptic={triggerHaptic}
      />

      {/* Flagship Feature: Create New Listing Wizard Modal */}
      <CreateListingWizardModal
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onNavigateToStudio={() => {
          setIsCreateWizardOpen(false);
          handleNavigateTab('studio');
        }}
      />

      {/* Overflow Menu Popup */}
      {isOverflowOpen && (
        <div className="mobile-overflow-backdrop" onClick={() => setIsOverflowOpen(false)}>
          <div className="mobile-overflow-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="mobile-overflow-item"
              onClick={() => {
                setIsOverflowOpen(false);
                setIsMarketplaceSheetOpen(true);
              }}
            >
              <ShoppingBag size={16} style={{ color: '#38bdf8' }} />
              <span>Switch Marketplace</span>
            </button>
            <button
              className="mobile-overflow-item"
              onClick={() => {
                setIsOverflowOpen(false);
                handleNavigateTab('more');
              }}
            >
              <Info size={16} style={{ color: '#38bdf8' }} />
              <span>App Settings & Info</span>
            </button>
            <button
              className="mobile-overflow-item"
              onClick={() => {
                setIsOverflowOpen(false);
                window.open('/data-deletion.html', '_blank');
              }}
            >
              <ExternalLink size={16} style={{ color: '#38bdf8' }} />
              <span>Data Deletion Portal</span>
            </button>
            {onSwitchToDesktop && !Capacitor.isNativePlatform() && (
              <button
                className="mobile-overflow-item"
                onClick={() => {
                  setIsOverflowOpen(false);
                  onSwitchToDesktop();
                }}
              >
                <MoreHorizontal size={16} style={{ color: '#38bdf8' }} />
                <span>Switch to Desktop View</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mobile-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
