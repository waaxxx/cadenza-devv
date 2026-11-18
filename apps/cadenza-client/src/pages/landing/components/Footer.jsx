import { appConfig } from "@/config";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { legalContact, privacyPolicy, termsAndConditions } from "@/pages/legal/policyContent";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [openPolicy, setOpenPolicy] = useState(null);
  const policy = openPolicy === "privacy" ? privacyPolicy : termsAndConditions;

  const copyrightYear =
    currentYear > appConfig.copyright.startYear
      ? `${appConfig.copyright.startYear}–${currentYear}`
      : currentYear;

  return (
    <footer className="mt-16 border-t bg-slate-50 pb-24 sm:pb-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 pt-6 sm:flex-row sm:px-6 sm:pr-72 lg:px-8 lg:pr-72">
        <p className="text-sm text-muted-foreground">
          © {copyrightYear} {appConfig.office.name}, {appConfig.name}. All
          rights reserved.
        </p>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <button type="button" onClick={() => setOpenPolicy("privacy")} className="hover:text-foreground">
            Privacy
          </button>

          <button type="button" onClick={() => setOpenPolicy("terms")} className="hover:text-foreground">
            Terms
          </button>

          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
      <Dialog dismissible={false} open={Boolean(openPolicy)} onOpenChange={(open) => { if (open) setOpenPolicy(openPolicy || "privacy"); }}>
        <DialogContent
          showCloseButton={false}
          className="grid max-h-[88vh] min-h-0 w-[min(92vw,1000px)] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden p-0"
          style={{ width: 'min(92vw, 1000px)', maxWidth: '1000px' }}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="relative border-b border-slate-200 px-6 pb-4 pt-6 pr-14">
            <DialogTitle className="text-2xl font-black">{policy?.title}</DialogTitle>
            <DialogDescription>Information for Cadenza Music Center clients and service users.</DialogDescription>
            <button type="button" onClick={() => setOpenPolicy(null)} className="absolute right-4 top-4 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950" aria-label="Close policy dialog">×</button>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto px-6 py-6 leading-7 text-slate-700">
            <p className="text-base">{policy?.intro}</p>
            <div className="mt-7 space-y-7">
              {policy?.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-bold text-slate-950">{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}
                  {section.bullets ? <ul className="mt-2 list-disc space-y-2 pl-6">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                  {section.paragraphsAfter?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}
                </section>
              ))}
              {openPolicy === "privacy" ? <section><h2 className="text-lg font-bold text-slate-950">13. Contact us</h2><div className="mt-2 rounded-xl bg-slate-50 p-4"><p className="font-semibold">{legalContact.operator}</p><p>{legalContact.address}</p><p>Email: <a className="text-blue-700 underline" href={`mailto:${legalContact.email}`}>{legalContact.email}</a></p><p>Phone: {legalContact.phone}</p><p className="mt-2">You may also contact the Philippine National Privacy Commission through <a className="text-blue-700 underline" href="https://privacy.gov.ph/" target="_blank" rel="noreferrer">privacy.gov.ph</a>.</p></div></section> : null}
            </div>
          </div>
          <DialogFooter className="border-t border-slate-200 px-6 py-4">
            <button type="button" onClick={() => setOpenPolicy(null)} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;
