import React, { useState } from 'react';
import { CardItem, CustomerCheckoutData } from '../types';
import { CRYPTO_OPTIONS } from '../data/mockCards';
import { X, Copy, Check, ShieldCheck, Coins, Cpu, QrCode, ArrowRight, Upload, AlertTriangle, FileCheck, CheckCircle2, UserCheck, Mail, MapPin, Globe, Key } from 'lucide-react';
import { playSuccessChime, playBeep } from '../utils/audio';

interface CryptoModalProps {
  card: CardItem;
  onClose: () => void;
  onSuccess: (cardId: string) => void;
}

type CheckoutStage = 'CRYPTO_PAYMENT' | 'PURCHASE_DONE';

export const CryptoModal: React.FC<CryptoModalProps> = ({ card, onClose, onSuccess }) => {
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('CRYPTO_PAYMENT');

  // Crypto Payment Option (USDT TRC20)
  const selectedCrypto = CRYPTO_OPTIONS[0];
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer Checkout Form Data
  const [checkoutData, setCheckoutData] = useState<CustomerCheckoutData>({
    customerName: '',
    email: '',
    address: '',
    region: 'Asia / Pakistan',
    sessionKey: '',
    paymentScreenshotName: '',
    paymentScreenshotUrl: null,
    txHash: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    playBeep(800, 0.02);
    setErrorMessage(null);
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  // Handle Screenshot File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playBeep(1100, 0.04);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCheckoutData((prev) => ({
          ...prev,
          paymentScreenshotName: file.name,
          paymentScreenshotUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    playBeep(1000, 0.04);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT SESSION KEY VALIDATION: Must strictly equal "D@rknet5907"
    if (checkoutData.sessionKey.trim() !== 'D@rknet5907') {
      playBeep(400, 0.2, 'sawtooth');
      setErrorMessage('ACCESS DENIED :: INVALID SESSION KEY! Access session key is invalid.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    playBeep(1200, 0.08);

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStage('PURCHASE_DONE');
      playSuccessChime();

      setTimeout(() => {
        onSuccess(card.id);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-black border border-emerald-500/70 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.35)] my-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-500 hover:text-white hover:bg-emerald-950 rounded-xl transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STAGE 1: CRYPTO PAYMENT & CUSTOMER FORM */}
        {checkoutStage === 'CRYPTO_PAYMENT' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-emerald-800/80 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Coins className="w-4 h-4 text-emerald-400" /> USDT PAYMENT & CUSTOMER CHECKOUT GATEWAY
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                CHECKOUT: {card.title}
              </h2>
              <p className="text-xs text-emerald-500 mt-1">
                Amount Required: <span className="text-white font-bold">${card.price} USDT</span> | Card Balance: <span className="text-emerald-300 font-bold">${card.balance.toLocaleString()} USD</span>
              </p>
            </div>

            {/* Selected USDT Badge */}
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-900 border border-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  USDT
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Tether USD (TRC-20)</span>
                  <span className="text-[10px] text-emerald-400">TRON Network (Fast Confirmation)</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-black px-3 py-1 rounded-lg border border-emerald-700">
                1 USDT = $1.00 USD
              </span>
            </div>

            {/* 2 Payment Images Container: Scanner + Wallet Details Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60">
              
              {/* Image 1: Scanner QR Code (Bt2.jpeg) */}
              <div className="flex flex-col items-center justify-center p-3 bg-black/90 rounded-xl border border-emerald-500/60 shadow-lg">
                <div className="relative p-2 bg-white rounded-lg border border-emerald-400 shadow-inner">
                  <img
                    src="/images/Bt2.jpeg"
                    alt="USDT TRC20 QR Code Scanner"
                    className="w-36 h-36 object-contain rounded"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-2 uppercase tracking-wider flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" /> SCAN QR TO PAY USDT (TRC-20)
                </span>
              </div>

              {/* Image 2: Wallet Address Image (Bt3.jpeg) */}
              <div className="flex flex-col items-center justify-between p-3 bg-black/90 rounded-xl border border-emerald-500/60 shadow-lg">
                <div className="w-full flex-1 flex flex-col items-center justify-center bg-white/95 rounded-lg p-2 border border-emerald-400 shadow-inner overflow-hidden">
                  <img
                    src="/images/Bt3.jpeg"
                    alt="USDT TRC20 Wallet Address Info"
                    className="w-full h-auto max-h-32 object-contain rounded"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-300 mt-2 uppercase tracking-wider text-center">
                  OFFICIAL TRC-20 WALLET DETAILS
                </span>
              </div>

            </div>

            {/* Deposit Address Box with Copy Button */}
            <div className="bg-black border border-emerald-700/80 rounded-xl p-3.5 shadow-inner">
              <span className="text-[10px] text-emerald-400 uppercase block tracking-wider font-bold mb-1.5 flex items-center justify-between">
                <span>USDT DEPOSIT WALLET ADDRESS (TRC-20)</span>
                <span className="text-emerald-500 font-mono text-[9px]">TRON NETWORK ONLY</span>
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedCrypto.address}
                  className="bg-emerald-950/40 border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white font-mono w-full outline-none select-all font-bold tracking-wide"
                />
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  title="Copy TRC20 Address"
                >
                  {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>{copied ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* CUSTOMER FORM SECTION */}
            <form onSubmit={handleConfirmPayment} className="space-y-4 pt-2 border-t border-emerald-900">
              
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-2">
                <UserCheck className="w-4 h-4 text-emerald-400" /> CUSTOMER CHECKOUT CREDENTIALS
              </div>

              {/* Error Banner when session key validation fails */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-mono flex items-start gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold uppercase tracking-wider block text-rose-200">VALIDATION ERROR</span>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Grid 2-cols: Customer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={checkoutData.customerName}
                    onChange={handleInputChange}
                    placeholder="Full Customer Name..."
                    className="w-full bg-black/90 border border-emerald-700/60 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-emerald-200 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={checkoutData.email}
                    onChange={handleInputChange}
                    placeholder="Customer Email Address..."
                    className="w-full bg-black/90 border border-emerald-700/60 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-emerald-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Full Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full street / delivery address..."
                  className="w-full bg-black/90 border border-emerald-700/60 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs text-emerald-200 outline-none font-mono resize-none"
                />
              </div>

              {/* Grid 2-cols: Region & Session Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Region / Country *
                  </label>
                  <select
                    name="region"
                    value={checkoutData.region}
                    onChange={handleInputChange}
                    className="w-full bg-black/90 border border-emerald-700/60 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-emerald-200 outline-none font-mono"
                  >
                    <option value="Asia / Pakistan">Asia / Pakistan</option>
                    <option value="Middle East / UAE">Middle East / UAE</option>
                    <option value="United States / North America">United States / North America</option>
                    <option value="United Kingdom / Europe">United Kingdom / Europe</option>
                    <option value="Global / Other Region">Global / Other Region</option>
                  </select>
                </div>

                {/* Session Key (USER TYPED, NO TOP HINT TEXT) */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" /> Session Key *
                  </label>
                  <input
                    type="password"
                    name="sessionKey"
                    required
                    value={checkoutData.sessionKey}
                    onChange={handleInputChange}
                    placeholder="Enter session key..."
                    className={`w-full bg-black/90 border rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest outline-none ${
                      errorMessage ? 'border-rose-500 text-rose-300' : 'border-emerald-700/60 focus:border-emerald-400 text-emerald-200'
                    }`}
                  />
                </div>
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" /> Attach Payment Screenshot (Optional Proof)
                </label>
                
                <div className="relative border border-dashed border-emerald-700/60 hover:border-emerald-400 rounded-xl p-3 bg-black/60 transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />

                  {checkoutData.paymentScreenshotUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={checkoutData.paymentScreenshotUrl}
                        alt="Payment Screenshot Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-400 shadow"
                      />
                      <div>
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {checkoutData.paymentScreenshotName}
                        </span>
                        <span className="text-[10px] text-emerald-500">Click to change screenshot</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-center py-1">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-300 font-semibold">Attach payment receipt screenshot image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Hash / TXID */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1">
                  TRANSACTION HASH / TXID (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="txHash"
                  value={checkoutData.txHash}
                  onChange={handleInputChange}
                  placeholder="Paste TRC-20 TXID hash (e.g. TFDiG9Jb... or 0x...)"
                  className="w-full bg-black/90 border border-emerald-700/60 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-emerald-200 outline-none font-mono"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-black" /> VERIFYING PAYMENT & AUTHORIZING...
                  </>
                ) : (
                  <>
                    CONFIRM USDT PAYMENT (${card.price}) <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STAGE 2: SUCCESS NOTIFICATION SCREEN */}
        {checkoutStage === 'PURCHASE_DONE' && (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900/80 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-bounce">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
              PAYMENT SUCCESSFUL!
            </h3>
            <div className="p-4 bg-emerald-950/90 rounded-2xl border border-emerald-500/80 text-emerald-200 text-xs sm:text-sm font-mono max-w-lg space-y-2 shadow-lg">
              <p className="font-extrabold text-white text-base">
                Payment Successful! Details will be shared with you on your email shortly.
              </p>
              <p className="text-xs text-emerald-400/90">
                Card credentials & verification key send to: <strong className="text-white">{checkoutData.email || 'your email'}</strong>
              </p>
            </div>
            <div className="p-3 bg-black rounded-xl border border-emerald-800 text-xs text-emerald-400 font-mono">
              STATUS: PAYMENT VERIFIED // EMAIL DISPATCH IN PROGRESS
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
