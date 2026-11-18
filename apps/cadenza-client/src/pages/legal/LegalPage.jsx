import { Link } from 'react-router-dom';

import { legalContact, privacyPolicy, termsAndConditions } from './policyContent';

export default function LegalPage({ type }) {
  const policy = type === 'privacy' ? privacyPolicy : termsAndConditions;
  const isPrivacy = type === 'privacy';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-6">
          <div><Link to="/" className="text-sm font-bold text-blue-700 hover:underline">Cadenza Music Center</Link><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{policy.title}</h1></div>
        </div>
        <div className="mt-8 space-y-8 leading-7 text-slate-700">
          <p className="text-lg">{policy.intro}</p>
          {policy.sections.map((section) => <section key={section.title}><h2 className="text-xl font-bold text-slate-950">{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}{section.bullets ? <ul className="mt-3 list-disc space-y-2 pl-6">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}{section.paragraphsAfter?.map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}</section>)}
          {isPrivacy ? <section><h2 className="text-xl font-bold text-slate-950">13. Contact us</h2><div className="mt-3 rounded-xl bg-slate-50 p-5"><p className="font-semibold">{legalContact.operator}</p><p>{legalContact.address}</p><p>Email: <a className="text-blue-700 underline" href={`mailto:${legalContact.email}`}>{legalContact.email}</a></p><p>Phone: {legalContact.phone}</p><p className="mt-3">You may also contact the Philippine National Privacy Commission through <a className="text-blue-700 underline" href="https://privacy.gov.ph/" target="_blank" rel="noreferrer">privacy.gov.ph</a>.</p></div></section> : null}
        </div>
        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm"><Link className="text-blue-700 hover:underline" to="/privacy">Privacy Policy</Link><Link className="text-blue-700 hover:underline" to="/terms">Terms and Conditions</Link><Link className="text-blue-700 hover:underline" to="/signup">Create an account</Link></div>
      </article>
    </main>
  );
}
