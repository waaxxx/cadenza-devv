import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/Input';
import { getGoogleOAuthUrl } from '@/services/auth/authService';
import { authService } from '@/services/auth/authService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { legalContact, privacyPolicy, termsAndConditions } from '@/pages/legal/policyContent';

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsRead, setTermsRead] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [legalDocument, setLegalDocument] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!termsAccepted) {
      setError('Please read and accept the Terms & Conditions before continuing.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.requestOtp({ email, purpose: 'signup' });
      navigate('/signup/verify', { state: { email, purpose: 'signup' } });
    } catch (requestError) {
      setError(requestError?.message || 'Unable to send the verification code.');
    } finally {
      setIsLoading(false);
    }
  }

  return <div className={cn('flex flex-col gap-6', className)} {...props}>
    <Card className="mx-auto min-w-0 border-0 bg-white/90 p-0 shadow-xl backdrop-blur" style={{ width: '560px', maxWidth: 'calc(100vw - 2rem)' }}><CardContent className="p-5 sm:p-7">
      <form className="w-full" onSubmit={handleSubmit}><FieldGroup>
        <div className="mx-auto grid size-10 place-items-center rounded-full bg-blue-100 text-blue-700"><UserRound className="size-5" /></div>
        <div className="flex flex-col items-center gap-2 text-center"><h1 className="text-xl font-bold sm:text-2xl">Create your account</h1><p className="text-sm text-balance text-muted-foreground">Enter your email and we’ll send you a one-time verification code.</p></div>
        <Field><FieldLabel htmlFor="signup-email">Email</FieldLabel><Input id="signup-email" type="email" autoComplete="email" placeholder="m@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field>
        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <input type="checkbox" checked={termsAccepted} onChange={(event) => { if (event.target.checked) { setLegalDocument('terms'); setTermsRead(false); setTermsOpen(true); } else setTermsAccepted(false); }} className="mt-0.5 accent-blue-700" />
          <span>I agree to the <button type="button" className="font-medium text-blue-700 underline" onClick={() => { setLegalDocument('terms'); setTermsOpen(true); }}>Terms & Conditions</button> and acknowledge the <button type="button" className="font-medium text-blue-700 underline" onClick={() => { setLegalDocument('privacy'); setTermsOpen(true); }}>Privacy Policy</button>. <button type="button" className="font-medium text-blue-700 underline" onClick={() => { setLegalDocument('terms'); setTermsOpen(true); }}>Review terms</button>.</span>
        </label>
        <Dialog dismissible={false} open={termsOpen} onOpenChange={(open) => { if (open) setTermsOpen(true); }}>
          <DialogContent showCloseButton={false} className="grid max-h-[88vh] min-h-0 w-[min(92vw,1000px)] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-0" style={{ width: 'min(92vw, 1000px)', maxWidth: '1000px' }} onPointerDownOutside={(event) => event.preventDefault()} onInteractOutside={(event) => event.preventDefault()}>
            <DialogHeader className="relative border-b border-slate-200 px-6 pb-4 pt-6 pr-14"><DialogTitle className="text-2xl font-black">{legalDocument === 'privacy' ? privacyPolicy.title : 'Terms & Conditions'}</DialogTitle><DialogDescription>{legalDocument === 'privacy' ? 'Information for Cadenza Music Center clients and service users.' : 'Read the complete terms before agreeing.'}</DialogDescription><button type="button" onClick={() => setTermsOpen(false)} className="absolute right-4 top-4 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950" aria-label="Close legal dialog">×</button></DialogHeader>
            <div className="min-h-0 overflow-y-auto px-6 py-6 leading-7 text-slate-700" onScroll={(event) => { const element = event.currentTarget; if (legalDocument === 'terms' && element.scrollTop + element.clientHeight >= element.scrollHeight - 4) setTermsRead(true); }}>
              <p className="text-base">{legalDocument === 'privacy' ? privacyPolicy.intro : termsAndConditions.intro}</p>
              <div className="mt-7 space-y-7">{(legalDocument === 'privacy' ? privacyPolicy.sections : termsAndConditions.sections).map((section) => <section key={section.title}><h2 className="text-lg font-bold text-slate-950">{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}{section.bullets ? <ul className="mt-2 list-disc space-y-2 pl-6">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}{section.paragraphsAfter?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}</section>)}{legalDocument === 'privacy' ? <section><h2 className="text-lg font-bold text-slate-950">13. Contact us</h2><div className="mt-2 rounded-xl bg-slate-50 p-4"><p className="font-semibold">{legalContact.operator}</p><p>{legalContact.address}</p><p>Email: <a className="text-blue-700 underline" href={`mailto:${legalContact.email}`}>{legalContact.email}</a></p><p>Phone: {legalContact.phone}</p><p className="mt-2">You may also contact the Philippine National Privacy Commission through <a className="text-blue-700 underline" href="https://privacy.gov.ph/" target="_blank" rel="noreferrer">privacy.gov.ph</a>.</p></div></section> : null}</div>
            </div>
            <DialogFooter className="border-t border-slate-200 px-6 py-4"><Button type="button" variant="outline" onClick={() => setTermsOpen(false)}>Close</Button>{legalDocument === 'terms' ? <Button type="button" disabled={!termsRead} onClick={() => { setTermsAccepted(true); setTermsOpen(false); }}>I Agree</Button> : null}</DialogFooter>
          </DialogContent>
        </Dialog>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={isLoading || !termsAccepted}>{isLoading ? 'Sending code...' : 'Agree and continue'}</Button>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>
        <Button type="button" disabled={!termsAccepted} onClick={() => { window.location.href = getGoogleOAuthUrl(); }}><GoogleIcon />Continue with Google</Button>
        <FieldDescription className="text-center">Already have an account? <button type="button" className="underline" onClick={() => navigate('/login')}>Sign in</button></FieldDescription>
      </FieldGroup></form>
    </CardContent></Card>
  </div>;
}

function GoogleIcon() { return <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" /></svg>; }
