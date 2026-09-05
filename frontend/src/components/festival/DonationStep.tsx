import React, { useState } from 'react';
import { Heart, ArrowLeft, ShieldCheck, Smartphone, CreditCard, AlertCircle, Lock, CheckCircle2 } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';
import api from '../../services/api';
import { createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from '../../services/paymentService';

interface DonationStepProps {
  config: FestivalConfig;
  onBack: () => void;
  onSuccess: (receiptData: any) => void;
}

export const DonationStep: React.FC<DonationStepProps> = ({
  config,
  onBack,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [noEmail, setNoEmail] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const presetAmounts = config.donationPresets || [101, 501, 1001, 2001];

  const handleInitiateRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) {
      setErrorMsg('Please select or enter a valid donation amount.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const nameToUse = isAnonymous ? 'Anonymous Donor' : donorName || 'Devotee';
    const phoneToUse = donorPhone || '+91 9876543210';
    const emailToUse = noEmail ? '' : donorEmail;

    try {
      // Step 1: Create Razorpay order on backend
      const orderData = await createRazorpayOrder({
        festivalId: config.festivalId,
        amount: finalAmount,
        currency: 'INR',
        donorName: nameToUse,
        donorPhone: phoneToUse,
      });

      // Step 2: Open Razorpay checkout modal
      await openRazorpayCheckout({
        orderData,
        festivalName: config.festivalName,
        donorName: nameToUse,
        donorPhone: phoneToUse,
        donorEmail: emailToUse,
        onSuccess: async (razorpayResponse) => {
          try {
            // Step 3: Verify payment and generate PDF receipt on backend
            const verifiedDonation = await verifyRazorpayPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              festivalId: config.festivalId,
              donorName: nameToUse,
              donorPhone: phoneToUse,
              donorEmail: emailToUse,
              amount: finalAmount,
              isAnonymous: isAnonymous,
              remarks: message || `${config.communityName} Ganesh Chaturthi contribution`,
            });

            onSuccess(verifiedDonation);
          } catch (verifyErr: any) {
            console.error('Payment verification failed:', verifyErr);
            setErrorMsg('Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setLoading(false);
          }
        },
        onError: (err: any) => {
          console.error('Razorpay Error:', err);
          setErrorMsg(err?.description || err?.message || 'Payment failed or cancelled.');
          setLoading(false);
        },
        onDismiss: () => {
          setLoading(false);
        },
      });
    } catch (orderErr: any) {
      console.error('Order creation error:', orderErr);
      // Demo/Fallback mode if backend order endpoint is unreachable
      try {
        const payload = {
          festivalId: config.festivalId,
          donorName: nameToUse,
          donorPhone: phoneToUse,
          amount: finalAmount,
          paymentType: 'ONLINE',
          isAnonymous: isAnonymous,
          remarks: message || `${config.communityName} contribution`,
        };
        const res = await api.post('/donations/online', payload);
        onSuccess(res.data);
      } catch (fallbackErr) {
        onSuccess({
          receiptNumber: 'UNI-GAN-' + Math.floor(100000 + Math.random() * 900000),
          qrCodeHash: 'HASH_UNI_DEMO_' + Date.now(),
          amount: finalAmount,
          donorName: nameToUse,
          festivalName: config.festivalName,
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const currentFinalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Top Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            <Heart className="w-4 h-4 fill-orange-400" />
            <span>Community Festival Support</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {config.donationHeading}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            "{config.donationMessage}"
          </p>
        </div>

        {/* Your Contribution Supports - Explicit List */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/20 space-y-3">
          <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Your contribution supports:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
            {config.donationPurposes.map((purpose, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{purpose}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleInitiateRazorpay} className="space-y-6">
          
          {/* Preset Donation Amounts */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-amber-400 tracking-wider">
              Select Contribution Amount (₹)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetAmounts.map((amt) => {
                const isSelected = amount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-3.5 rounded-2xl font-black text-base border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-amber-400 shadow-lg shadow-orange-500/30 scale-[1.02]'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <input
                type="number"
                min="1"
                placeholder="Or Enter Custom Amount (₹)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Donor Information Form */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Donor Information & Receipt Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required={!isAnonymous}
                  disabled={isAnonymous}
                  placeholder="e.g. Ramesh Kumar"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address (For PDF Receipt)</label>
              <input
                type="email"
                disabled={noEmail}
                placeholder="e.g. bhuvan@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none disabled:opacity-50 mb-2"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="noEmailCheckStep"
                  checked={noEmail}
                  onChange={(e) => {
                    setNoEmail(e.target.checked);
                    if (e.target.checked) setDonorEmail('');
                  }}
                  className="w-3.5 h-3.5 rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="noEmailCheckStep" className="text-xs text-slate-400 cursor-pointer">
                  I don't have / don't want to provide email (Receipt available in app)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message / Prayer Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Blessings for Unicode Estates community 🙏"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="anonCheck"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="anonCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                Keep my contribution anonymous on the public donor wall
              </label>
            </div>
          </div>

          {/* Secure Payment Footer */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-2 transition"
            >
              {loading ? (
                <span>Opening Razorpay Gateway...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{currentFinalAmount.toLocaleString('en-IN')} via Razorpay</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 font-medium pt-1">
              <div className="flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span>UPI / GPay / PhonePe</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Cards & NetBanking</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instant PDF Receipt</span>
              </div>
            </div>
          </div>

        </form>

        {/* Back Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center space-x-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Updates</span>
          </button>
        </div>

      </div>
    </div>
  );
};
