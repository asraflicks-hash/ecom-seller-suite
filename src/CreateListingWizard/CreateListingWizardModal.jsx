// src/CreateListingWizard/CreateListingWizardModal.jsx - Master Multi-Step Wizard Modal
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  RotateCcw, 
  Check, 
  Layers,
  Save
} from 'lucide-react';
import Step1MarketplaceSelect from './Step1MarketplaceSelect.jsx';
import Step2ReferenceProduct from './Step2ReferenceProduct.jsx';
import Step3ProductDetails from './Step3ProductDetails.jsx';
import Step4GenerateListing from './Step4GenerateListing.jsx';
import Step5CopyPasteExport from './Step5CopyPasteExport.jsx';
import Step6GoLiveTracker from './Step6GoLiveTracker.jsx';
import { UI_LANG } from '../marketplaceRulesConfig.js';

const STORAGE_DRAFT_KEY = 'ssp_create_listing_wizard_draft';

const STEPS = [
  { id: 1, titleEn: 'Marketplaces', titleHi: 'Marketplaces' },
  { id: 2, titleEn: 'Reference', titleHi: 'Reference' },
  { id: 3, titleEn: 'My Details', titleHi: 'My Details' },
  { id: 4, titleEn: 'Generate', titleHi: 'Generate' },
  { id: 5, titleEn: 'Copy-Paste', titleHi: 'Copy-Paste' },
  { id: 6, titleEn: 'Go Live', titleHi: 'Go Live' }
];

export default function CreateListingWizardModal({
  isOpen,
  onClose,
  onNavigateToStudio
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [isRestored, setIsRestored] = useState(false);

  // Core Wizard States
  const [selectedMarketplaces, setSelectedMarketplaces] = useState(['amazon', 'flipkart', 'meesho']);
  const [referenceData, setReferenceData] = useState({
    url: '',
    rawText: '',
    marketplace: 'amazon',
    identifier: null,
    extracted: null,
    audit: null,
    competitorKeywords: [],
    fallbackRequired: false
  });
  const [competitorKeywords, setCompetitorKeywords] = useState([]);
  const [productDetails, setProductDetails] = useState({
    title: '',
    brand: '',
    category: 'Home & Kitchen',
    model: '',
    color: '',
    size: '',
    material: '',
    packSize: 'Pack of 1',
    weight: '350',
    mrp: '',
    sp: '',
    cogs: '',
    gstPct: 18,
    hsnCode: '7323',
    features: ['', '', '', ''],
    freeformFeatures: '',
    targetCustomer: '',
    images: {}
  });
  const [generatedListings, setGeneratedListings] = useState({});

  // Restore Draft from localStorage on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (stored) {
        const draft = JSON.parse(stored);
        if (draft) {
          if (draft.selectedMarketplaces) setSelectedMarketplaces(draft.selectedMarketplaces);
          if (draft.referenceData) setReferenceData(draft.referenceData);
          if (draft.competitorKeywords) setCompetitorKeywords(draft.competitorKeywords);
          if (draft.productDetails) setProductDetails(draft.productDetails);
          if (draft.generatedListings) setGeneratedListings(draft.generatedListings);
          if (draft.currentStep) setCurrentStep(draft.currentStep);
          if (draft.lang) setLang(draft.lang);
          setIsRestored(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Autosave Draft on State Change
  useEffect(() => {
    if (!isOpen) return;
    try {
      const draft = {
        selectedMarketplaces,
        referenceData,
        competitorKeywords,
        productDetails,
        generatedListings,
        currentStep,
        lang,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [selectedMarketplaces, referenceData, competitorKeywords, productDetails, generatedListings, currentStep, lang, isOpen]);

  if (!isOpen) return null;

  const t = UI_LANG[lang] || UI_LANG.en;

  // Toggle Marketplace Selection
  const handleToggleMarketplace = (mpId) => {
    setSelectedMarketplaces(prev => {
      if (prev.includes(mpId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== mpId);
      } else {
        return [...prev, mpId];
      }
    });
  };

  // Toggle Competitor Keyword Selection
  const handleToggleKeyword = (kw) => {
    setCompetitorKeywords(prev => {
      if (prev.includes(kw)) {
        return prev.filter(k => k !== kw);
      } else {
        return [...prev, kw];
      }
    });
  };

  // Reset Draft Helper
  const handleResetDraft = () => {
    if (window.confirm('Reset draft and start with a fresh product listing?')) {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      setCurrentStep(1);
      setSelectedMarketplaces(['amazon', 'flipkart', 'meesho']);
      setReferenceData({
        url: '',
        rawText: '',
        marketplace: 'amazon',
        identifier: null,
        extracted: null,
        audit: null,
        competitorKeywords: [],
        fallbackRequired: false
      });
      setCompetitorKeywords([]);
      setProductDetails({
        title: '',
        brand: '',
        category: 'Home & Kitchen',
        model: '',
        color: '',
        size: '',
        material: '',
        packSize: 'Pack of 1',
        weight: '350',
        mrp: '',
        sp: '',
        cogs: '',
        gstPct: 18,
        hsnCode: '7323',
        features: ['', '', '', ''],
        freeformFeatures: '',
        targetCustomer: '',
        images: {}
      });
      setGeneratedListings({});
      setIsRestored(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (!productDetails.title?.trim() && !productDetails.productName?.trim()) {
        alert('Please enter a Product Name or Title.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 10, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '94vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1d 100%)',
        border: '1.5px solid rgba(0, 210, 255, 0.35)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 210, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00d2ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              color: '#000000',
              fontSize: '15px'
            }}>
              ➕
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{t.wizardTitle}</span>
                {isRestored && (
                  <span style={{ fontSize: '10px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    Draft Restored
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {t.wizardSubtitle}
              </div>
            </div>
          </div>

          {/* Right Header Controls: Reset, Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Reset Draft */}
            <button
              type="button"
              onClick={handleResetDraft}
              title="Reset Draft"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Draft</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stepper & Progress Bar */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(10, 15, 29, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Stepper items */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            {STEPS.map((step) => {
              const isPassed = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isCurrent ? 1 : isPassed ? 0.8 : 0.45,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isCurrent ? '#00d2ff' : isPassed ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrent || isPassed ? '#000000' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}>
                    {isPassed ? <Check size={12} strokeWidth={3} /> : step.id}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isCurrent ? '800' : '600',
                    color: isCurrent ? '#00d2ff' : isPassed ? '#ffffff' : '#94a3b8'
                  }}>
                    {step.titleEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress fill */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(currentStep / 6) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00d2ff 0%, #a855f7 50%, #22c55e 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          {currentStep === 1 && (
            <Step1MarketplaceSelect
              selectedMarketplaces={selectedMarketplaces}
              onToggleMarketplace={handleToggleMarketplace}
              lang={lang}
            />
          )}

          {currentStep === 2 && (
            <Step2ReferenceProduct
              referenceData={referenceData}
              onUpdateReferenceData={setReferenceData}
              productDetails={productDetails}
              onUpdateDetails={setProductDetails}
              generatedListings={generatedListings}
              onUpdateGeneratedListings={setGeneratedListings}
              competitorKeywords={competitorKeywords}
              onToggleKeyword={handleToggleKeyword}
              onNavigateToStep={setCurrentStep}
              selectedMarketplaces={selectedMarketplaces}
              lang={lang}
            />
          )}

          {currentStep === 3 && (
            <Step3ProductDetails
              productDetails={productDetails}
              onUpdateDetails={setProductDetails}
              onNavigateToStudio={() => {
                onClose();
                if (onNavigateToStudio) onNavigateToStudio();
              }}
              lang={lang}
            />
          )}

          {currentStep === 4 && (
            <Step4GenerateListing
              selectedMarketplaces={selectedMarketplaces}
              productDetails={productDetails}
              referenceData={referenceData}
              competitorKeywords={competitorKeywords}
              generatedListings={generatedListings}
              onUpdateGeneratedListings={setGeneratedListings}
              lang={lang}
            />
          )}

          {currentStep === 5 && (
            <Step5CopyPasteExport
              selectedMarketplaces={selectedMarketplaces}
              generatedListings={generatedListings}
              productDetails={productDetails}
              onUpdateSingleField={(platform, key, val) => {
                setGeneratedListings(prev => {
                  const copy = { ...prev };
                  if (copy[platform]) {
                    copy[platform] = { ...copy[platform], [key]: val };
                  }
                  return copy;
                });
              }}
              lang={lang}
            />
          )}

          {currentStep === 6 && (
            <Step6GoLiveTracker
              selectedMarketplaces={selectedMarketplaces}
              productDetails={productDetails}
              generatedListings={generatedListings}
              lang={lang}
            />
          )}
        </div>

        {/* Bottom Navigation Controls Bar */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Back button */}
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handleBack}
            style={{
              background: currentStep === 1 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '10px 18px',
              color: currentStep === 1 ? '#64748b' : '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.btnBack}</span>
          </button>

          {/* Privacy Note */}
          <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
            🔒 Local browser session • Zero server storage
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={currentStep === 6 ? onClose : handleNext}
            className="kinara-glow-dynamic"
            style={{
              '--glow-color': '#00d2ff',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: '1px solid #38bdf8',
              borderRadius: '10px',
              padding: '10px 22px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{currentStep === 6 ? 'Finish & Close' : t.btnNext}</span>
            {currentStep < 6 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
