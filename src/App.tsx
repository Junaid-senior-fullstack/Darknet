import React, { useState, useEffect } from 'react';
import { CardItem as CardItemType, UserJobData, AppPhase, PurchasedLinkItem } from './types';
import { INITIAL_CARDS } from './data/mockCards';
import { AccessForm } from './components/AccessForm';
import { Header } from './components/Header';
import { CardItem } from './components/CardItem';
import { CryptoModal } from './components/CryptoModal';
import { ReplacementModal } from './components/ReplacementModal';
import { LockoutScreen } from './components/LockoutScreen';
import { BuyLinkCard } from './components/BuyLinkCard';
import { LinkCryptoModal } from './components/LinkCryptoModal';
import { ApplyNoticeModal } from './components/ApplyNoticeModal';
import { setMuted } from './utils/audio';
import { ShieldAlert, Terminal, Lock, Cpu, Sparkles, Filter, AlertTriangle } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('JOB_FORM');
  const [userData, setUserData] = useState<UserJobData | null>(null);
  const [cards, setCards] = useState<CardItemType[]>(INITIAL_CARDS);
  const [purchasedLink, setPurchasedLink] = useState<PurchasedLinkItem | null>(null);
  const [portalTimeRemaining, setPortalTimeRemaining] = useState<number>(15 * 60); // 15 minutes in seconds
  const [isMuted, setIsMuted] = useState(false);

  // Active Modals
  const [buyingCard, setBuyingCard] = useState<CardItemType | null>(null);
  const [replacingCard, setReplacingCard] = useState<CardItemType | null>(null);
  const [isApplyNoticeOpen, setIsApplyNoticeOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // 15-Minute Portal Session Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'PORTAL') {
      timer = setInterval(() => {
        setPortalTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('LOCKED_OUT');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  // Toggle Mute Audio
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  };

  // Reset Everything back to step 1
  const handleResetSession = () => {
    setPhase('JOB_FORM');
    setUserData(null);
    setCards(INITIAL_CARDS);
    setPurchasedLink(null);
    setPortalTimeRemaining(15 * 60);
    setBuyingCard(null);
    setReplacingCard(null);
    setIsApplyNoticeOpen(false);
    setIsLinkModalOpen(false);
  };

  // Link Purchase Handler
  const handleLinkCryptoSuccess = (targetEmail: string) => {
    setPurchasedLink({
      id: `link-${Date.now()}`,
      price: 200,
      email: targetEmail,
      purchasedAt: Date.now(),
      activationTimerEnd: Date.now() + 12 * 3600 * 1000, // 12 hours
      status: 'PENDING_ACTIVATION',
    });
    setIsLinkModalOpen(false);
  };

  // Step 1: Form Submit -> Move to Main Landing Portal
  const handleFormSubmit = (data: UserJobData) => {
    setUserData(data);
    setPhase('PORTAL');
  };

  // Step 3: Card Buy Handler
  const handleBuyCard = (card: CardItemType) => {
    setBuyingCard(card);
  };

  // Crypto Payment Success
  const handleCryptoSuccess = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              purchased: true,
              purchasedAt: Date.now(),
              replacementTimerEnd: Date.now() + 20 * 3600 * 1000, // 20 hours
            }
          : c
      )
    );
    setBuyingCard(null);
  };

  // Request Replacement Handler
  const handleRequestReplacement = (card: CardItemType) => {
    setReplacingCard(card);
  };

  // Replacement Success Handler
  const handleReplacementSuccess = (cardId: string, updated: Partial<CardItemType>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updated } : c))
    );
    setReplacingCard(null);
  };

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono selection:bg-emerald-900 selection:text-white">
      

      {/* PHASE 2: JOB DATA / CREDENTIAL ACCESS FORM */}
      {phase === 'JOB_FORM' && (
        <AccessForm onSubmit={handleFormSubmit} />
      )}

      {/* PHASE 3: MAIN LANDING PAGE / TERMINAL PORTAL */}
      {phase === 'PORTAL' && (
        <div className="min-h-screen flex flex-col">
          {/* Header Navigation */}
          <Header
            userData={userData}
            portalTimeRemaining={portalTimeRemaining}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onResetSession={handleResetSession}
            onApplyNow={() => setIsApplyNoticeOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Terminal Hero Banner */}
            <div className="relative rounded-2xl border border-emerald-500/50 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-black to-emerald-950/30 overflow-hidden shadow-[0_0_35px_rgba(16,185,129,0.2)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
                <Terminal className="w-48 h-48 text-emerald-400" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> VIRTUAL TEST CARD MARKETPLACE
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]">
                  ACTIVE TERMINAL CARDS
                </h1>
                <p className="text-xs sm:text-sm text-emerald-400/90 leading-relaxed">
                  Select a test card below to initiate crypto deposit. Every unlocked card includes an <span className="text-white font-bold underline decoration-emerald-500">Automatic 20-Hour Replacement Guarantee</span> with instant replacement options.
                </p>

                {/* User Job Profile Badge */}
                {userData && (
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-300">
                    <span className="bg-black/80 px-3 py-1 rounded-lg border border-emerald-800">
                      OPERATIVE: <strong className="text-white">{userData.agentName}</strong>
                    </span>
                    <span className="bg-black/80 px-3 py-1 rounded-lg border border-emerald-800">
                      ROLE: <strong className="text-emerald-400">{userData.roleJob}</strong>
                    </span>
                    <button
                      onClick={() => setIsApplyNoticeOpen(true)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1 rounded-lg border border-emerald-400 font-extrabold text-xs uppercase cursor-pointer transition-all shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    >
                      APPLY NOW
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Buy Direct Access Link Banner ($40 Option) */}
            <BuyLinkCard
              purchasedLink={purchasedLink}
              onOpenBuyModal={() => setIsApplyNoticeOpen(true)}
            />

            {/* Cards Grid Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-emerald-400" /> AVAILABLE TEST CARDS & BULK PACKS ({cards.length})
              </div>
              <span className="text-xs text-emerald-400 font-bold hidden sm:inline-block bg-emerald-950 px-3 py-1 rounded border border-emerald-800">
                PAYMENT METHOD: USDT (TRC-20) ONLY
              </span>
            </div>

            {/* Cards Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  onBuy={handleBuyCard}
                  onRequestReplacement={handleRequestReplacement}
                />
              ))}
            </div>

            {/* Bottom System Audit Log & Rules */}
            <div className="p-5 rounded-2xl bg-black/90 border border-emerald-900/80 text-xs text-emerald-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldAlert className="w-4 h-4" /> GUARANTEE & SYSTEM PROTOCOLS
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-400/80">
                <li>Cards automatically attach a 20-Hour Replacement Guarantee upon crypto purchase.</li>
                <li>Portal sessions are strictly bound to 15 minutes of continuous encryption.</li>
                <li>Crypto transactions auto-confirm with instant credential key delivery.</li>
              </ul>
            </div>

          </main>
        </div>
      )}

      {/* PHASE 4: 24-HOUR LOCKOUT SCREEN WHEN 15 MIN EXPIRES */}
      {phase === 'LOCKED_OUT' && (
        <LockoutScreen onReset={handleResetSession} />
      )}

      {/* CRYPTO PAYMENT MODAL */}
      {buyingCard && (
        <CryptoModal
          card={buyingCard}
          onClose={() => setBuyingCard(null)}
          onSuccess={handleCryptoSuccess}
        />
      )}

      {/* REPLACEMENT MODAL */}
      {replacingCard && (
        <ReplacementModal
          card={replacingCard}
          onClose={() => setReplacingCard(null)}
          onReplaceSuccess={handleReplacementSuccess}
        />
      )}

      {/* APPLY NOW ENGLISH NOTICE MODAL */}
      {isApplyNoticeOpen && (
        <ApplyNoticeModal
          onClose={() => setIsApplyNoticeOpen(false)}
          onProceed={() => {
            setIsApplyNoticeOpen(false);
            setIsLinkModalOpen(true);
          }}
        />
      )}

      {/* LINK CRYPTO PURCHASE MODAL ($40) */}
      {isLinkModalOpen && (
        <LinkCryptoModal
          initialEmail={userData?.email || ''}
          onClose={() => setIsLinkModalOpen(false)}
          onSuccess={handleLinkCryptoSuccess}
        />
      )}

    </div>
  );
}
