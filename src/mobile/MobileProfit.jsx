// src/mobile/MobileProfit.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  MoreVertical,
  DollarSign,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function MobileProfit({
  activeMarketplace,
  initialSegment = 'rto',
  onOpenMarketplaceSheet,
  onOpenOverflow,
  triggerHaptic
}) {
  const [activeSegment, setActiveSegment] = useState(initialSegment || 'rto');

  useEffect(() => {
    if (initialSegment) {
      setActiveSegment(initialSegment);
    }
  }, [initialSegment]);

  // RTO Simulator State
  const [sellingPrice, setSellingPrice] = useState(899);
  const [cogs, setCogs] = useState(280);
  const [forwardShipping, setForwardShipping] = useState(75);
  const [reverseShipping, setReverseShipping] = useState(65);
  const [rtoRate, setRtoRate] = useState(25); // 25% average Indian COD RTO

  // BuyBox Repricer State
  const [myPrice, setMyPrice] = useState(699);
  const [floorPrice, setFloorPrice] = useState(550);
  const [competitorPrice, setCompetitorPrice] = useState(649);
  const [marketplaceFeePct, setMarketplaceFeePct] = useState(14); // 14% category fee

  // Real-time RTO Calculations
  const rtoCalc = useMemo(() => {
    const sp = Number(sellingPrice) || 0;
    const cp = Number(cogs) || 0;
    const fwd = Number(forwardShipping) || 0;
    const rev = Number(reverseShipping) || 0;
    const rto = Math.max(0, Math.min(100, Number(rtoRate) || 0)) / 100;

    // In 100 orders:
    const deliveredCount = 100 * (1 - rto);
    const rtoCount = 100 * rto;

    // Profit per delivered unit = SP - COGS - FWD - (Marketplace fee ~15% of SP)
    const mktFee = sp * 0.15;
    const profitDelivered = sp - cp - fwd - mktFee;

    // Loss per RTO unit = Forward shipping + Reverse shipping + Packaging loss (~₹15)
    const lossRto = fwd + rev + 15;

    const totalBatchProfit = (deliveredCount * profitDelivered) - (rtoCount * lossRto);
    const netPerOrder = totalBatchProfit / 100;

    // Break-even RTO calculation
    // delivered * profitDelivered = rto * lossRto
    // (1 - x) * profitDelivered = x * lossRto => profitDelivered = x * (lossRto + profitDelivered)
    const breakEvenRate = (profitDelivered + lossRto) > 0 ? (profitDelivered / (profitDelivered + lossRto)) * 100 : 0;

    return {
      profitDelivered: Math.round(profitDelivered),
      lossRto: Math.round(lossRto),
      netPerOrder: Math.round(netPerOrder),
      breakEvenRate: Math.max(0, Math.min(100, Math.round(breakEvenRate))),
      isHealthy: netPerOrder > 50
    };
  }, [sellingPrice, cogs, forwardShipping, reverseShipping, rtoRate]);

  // Real-time Repricer Calculations
  const repriceCalc = useMemo(() => {
    const floor = Number(floorPrice) || 0;
    const comp = Number(competitorPrice) || 0;
    const feePct = (Number(marketplaceFeePct) || 0) / 100;

    // Reprice logic: 1 rupee below competitor, but strictly capped at floorPrice
    let target = comp - 1;
    let hitFloor = false;

    if (target < floor) {
      target = floor;
      hitFloor = true;
    }

    const netRealized = target * (1 - feePct);

    return {
      targetPrice: target,
      hitFloor,
      netRealized: Math.round(netRealized)
    };
  }, [floorPrice, competitorPrice, marketplaceFeePct]);

  const getMarketplaceDisplayName = (mp) => {
    switch ((mp || 'amazon').toLowerCase()) {
      case 'flipkart': return 'Flipkart';
      case 'meesho': return 'Meesho';
      default: return 'Amazon';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Top App Bar */}
      <header className="mobile-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="mobile-logo-mark">
            S
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            Profit
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              onOpenMarketplaceSheet();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <span>{getMarketplaceDisplayName(activeMarketplace)}</span>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>

          <button
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              onOpenOverflow();
            }}
            className="mobile-icon-btn"
            style={{ width: '40px', height: '40px' }}
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mobile-scroll-container">
        {/* Segmented Control */}
        <div className="mobile-segmented-control" role="tablist">
          <button
            className={`mobile-segment-pill ${activeSegment === 'rto' ? 'active' : ''}`}
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              setActiveSegment('rto');
            }}
            role="tab"
          >
            RTO Simulator
          </button>
          <button
            className={`mobile-segment-pill ${activeSegment === 'repricer' ? 'active' : ''}`}
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              setActiveSegment('repricer');
            }}
            role="tab"
          >
            BuyBox Repricer
          </button>
        </div>

        {/* ============================================================== */}
        {/* SEGMENT 1: RTO PROFIT SIMULATOR                                */}
        {/* ============================================================== */}
        {activeSegment === 'rto' && (
          <div>
            <div className="mobile-input-row">
              <div className="mobile-input-group">
                <label className="mobile-input-label">Selling Price (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>

              <div className="mobile-input-group">
                <label className="mobile-input-label">Cost of Goods (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                />
              </div>
            </div>

            <div className="mobile-input-row">
              <div className="mobile-input-group">
                <label className="mobile-input-label">Forward Ship (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={forwardShipping}
                  onChange={(e) => setForwardShipping(e.target.value)}
                />
              </div>

              <div className="mobile-input-group">
                <label className="mobile-input-label">RTO Return Ship (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={reverseShipping}
                  onChange={(e) => setReverseShipping(e.target.value)}
                />
              </div>
            </div>

            <div className="mobile-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="mobile-input-label">Estimated RTO Rate (%)</label>
                <span style={{ fontSize: '13px', fontWeight: '700', color: rtoRate > 30 ? '#ef4444' : '#38bdf8' }}>
                  {rtoRate}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={rtoRate}
                onChange={(e) => setRtoRate(e.target.value)}
                style={{ width: '100%', accentColor: '#38bdf8', height: '6px' }}
              />
            </div>

            {/* Results Card */}
            <div className="mobile-card" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Realized Net Profit / Order</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: rtoCalc.isHealthy ? '#22c55e' : '#ef4444' }}>
                    ₹{rtoCalc.netPerOrder}
                  </div>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', background: rtoCalc.isHealthy ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: rtoCalc.isHealthy ? '#22c55e' : '#ef4444' }}>
                  {rtoCalc.isHealthy ? 'Profitable' : 'Loss Hazard'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--mobile-border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1' }}>
                  <span>Delivered Unit Gain:</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>+₹{rtoCalc.profitDelivered}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1' }}>
                  <span>RTO Return Loss / Unit:</span>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>-₹{rtoCalc.lossRto}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1' }}>
                  <span>Max Break-Even RTO:</span>
                  <span style={{ color: '#eab308', fontWeight: '700' }}>{rtoCalc.breakEvenRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEGMENT 2: BUYBOX REPRICER                                     */}
        {/* ============================================================== */}
        {activeSegment === 'repricer' && (
          <div>
            <div className="mobile-input-row">
              <div className="mobile-input-group">
                <label className="mobile-input-label">Competitor Price (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(e.target.value)}
                />
              </div>

              <div className="mobile-input-group">
                <label className="mobile-input-label">Floor Safeguard (₹)</label>
                <input
                  type="number"
                  className="mobile-input"
                  value={floorPrice}
                  onChange={(e) => setFloorPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Platform Referral Commission (%)</label>
              <input
                type="number"
                className="mobile-input"
                value={marketplaceFeePct}
                onChange={(e) => setMarketplaceFeePct(e.target.value)}
              />
            </div>

            {/* Repricer Result Card */}
            <div className="mobile-card" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Recommended BuyBox Bid</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8' }}>
                    ₹{repriceCalc.targetPrice}
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <TrendingUp size={22} />
                </div>
              </div>

              {repriceCalc.hitFloor ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', fontSize: '12px', fontWeight: '600' }}>
                  <AlertTriangle size={16} />
                  <span>Capped at your minimum margin floor (₹{floorPrice}). Competitor is selling below healthy threshold.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>
                  <CheckCircle2 size={16} />
                  <span>Undercuts competitor by ₹1 to win BuyBox position safely.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
