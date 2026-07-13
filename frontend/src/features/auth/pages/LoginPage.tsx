import React, { useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { Button } from '../../../components/common/Button';
import { KeyRound, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  // States
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    // Only allow the pre-configured admin demo email
    if (email.toLowerCase() === 'admin@ecosphere.com') {
      setTimeout(() => {
        setMessage('A 5-digit verification code has been sent to admin@ecosphere.com');
        setStep('otp');
        setLoading(false);
      }, 600);
      return;
    }

    setError("Evaluation Mode: Only 'admin@ecosphere.com' is allowed for login.");
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    // Bypass verification check for admin demo account
    if (email.toLowerCase() === 'admin@ecosphere.com') {
      if (otp === '12345') {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@ecosphere.com',
            password: 'Password123'
          });
          if (error) throw error;
          if (data.session) {
            navigate('/');
          }
        } catch (err: any) {
          setError(err.message || 'Authentication error. Please contact developer.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid or expired code. Please verify and try again.');
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      if (data.session) {
        // Successful login, navigate to dashboard
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired code. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/80 rounded-xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            {step === 'email' ? <KeyRound className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            {step === 'email' ? 'Welcome to EcoSphere' : 'Enter Verification Code'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {step === 'email' 
              ? 'Enter your email address to receive a 5-digit verification code.'
              : `Type the verification code we sent to your inbox.`
            }
          </p>
        </div>

        {/* Notifications alerts */}
        {message && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' ? (
          <>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-zinc-400 uppercase tracking-wide">Corporate Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4.5 w-4.5 text-zinc-500 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full h-10 pl-10 pr-3 bg-zinc-950/40 border border-border text-sm rounded-lg text-zinc-200 focus-visible:outline-none focus:border-zinc-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Get OTP Code
              </Button>
            </form>
            <div className="pt-4 border-t border-border/50 text-[10px] text-zinc-500 space-y-1.5 font-mono">
              <div className="font-semibold text-zinc-400 uppercase tracking-wider">Evaluation Credentials:</div>
              <div>🛡️ <span className="text-teal-400 font-semibold">Demo Admin:</span> admin@ecosphere.com / Code: 12345</div>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-zinc-400 uppercase tracking-wide">5-Digit Code</label>
              <input
                type="text"
                required
                maxLength={5}
                placeholder="e.g. 12345"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={loading}
                className="w-full h-10 px-3 tracking-[0.5em] text-center font-mono text-lg bg-zinc-950/40 border border-border rounded-lg text-zinc-200 focus-visible:outline-none focus:border-zinc-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
              >
                Verify & Login
              </Button>
              
              <button
                type="button"
                onClick={() => setStep('email')}
                disabled={loading}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors w-full text-center block"
              >
                &larr; Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
