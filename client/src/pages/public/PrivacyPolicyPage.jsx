import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import './privacy-policy.css';

// IMPORTANT: Replace this placeholder with your real privacy contact email
// before publishing the policy or submitting the page to Pinterest.
const PRIVACY_CONTACT_EMAIL = 'YOUR_CONTACT_EMAIL@example.com';
const lastUpdated = '24 November 2026';

const sections = [
  { id: 'information', label: 'Information we collect' },
  { id: 'use', label: 'How we use information' },
  { id: 'third-parties', label: 'Services and third parties' },
  { id: 'pinterest', label: 'Social-media links and Pinterest' },
  { id: 'storage', label: 'Storage, security and retention' },
  { id: 'choices', label: 'Your choices and requests' },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

export default function PrivacyPolicyPage() {
  const hasContact = !PRIVACY_CONTACT_EMAIL.includes('YOUR_CONTACT_EMAIL');

  return (
    <main className="privacy-page container">
      <Link className="privacy-back" to="/"><ArrowLeft size={16} /> Back to SaveLoop</Link>
      <section className="privacy-hero">
        <div className="privacy-hero-icon" aria-hidden="true"><ShieldCheck size={25} /></div>
        <div>
          <span className="privacy-eyebrow">YOUR DATA, YOUR CHOICE</span>
          <h1>Privacy Policy</h1>
          <p>How SaveLoop handles the information you choose to save and share with our service.</p>
          <span className="privacy-updated">Last updated: {lastUpdated}</span>
        </div>
      </section>
      <div className="privacy-layout">
        <nav className="privacy-contents" aria-label="Privacy policy sections">
          <strong>On this page</strong>
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>

        <article className="privacy-document">
          <p><strong>SaveLoop</strong> is a personal bookmarking and content rediscovery web application. You can save links to websites and social-media posts, organise them, and search your own collection. This policy explains what information the application uses, how it is processed, and your choices.</p>
          <p>This policy describes SaveLoop's intended operation; certain integrations, including AI-based analysis and platform metadata retrieval, may be enabled or unavailable depending on the current deployment.</p>

          <section id="information">
            <h2>1. Information we collect</h2>
            <ul>
              <li><strong>Account information:</strong> Your name, email address, Firebase user identifier, and account settings. Authentication credentials are handled by Firebase Authentication; SaveLoop's application database does not need to store your password.</li>
              <li><strong>Bookmarks:</strong> URLs you submit, titles, categories, tags, notes, status, priority, saved timestamps, and reminders.</li>
              <li><strong>Assistant conversations:</strong> Questions sent to the SaveLoop assistant, answers, and referenced saved bookmarks when chat history is enabled.</li>
              <li><strong>Technical information:</strong> Basic request and diagnostic information may be processed by the application's hosting and service providers. Your browser may store sign-in state and interface preferences, such as the selected theme.</li>
            </ul>
          </section>

          <section id="use">
            <h2>2. How we use information</h2>
            <p>We use this information to authenticate users, save and organise bookmarks, detect link platforms, retrieve permitted metadata, suggest categories, search your personal library, show reminders, respond to assistant queries, maintain service security, and troubleshoot errors.</p>
            <p>Where AI analysis is enabled, titles, notes, tags, and other permitted text may be sent to an AI service to generate suggestions, embeddings or contextual answers. Results may be incomplete and can be edited by the user.</p>
          </section>

          <section id="third-parties">
            <h2>3. Services and third parties</h2>
            <p>Depending on which features are enabled, SaveLoop uses or may use these providers:</p>
            <ul>
              <li><strong>Google Firebase:</strong> Account authentication and session management.</li>
              <li><strong>MongoDB Atlas:</strong> Storage of application data such as user profiles, bookmarks, reminders and chat history.</li>
              <li><strong>OpenAI:</strong> AI-assisted classification, answer generation and semantic embeddings where configured.</li>
              <li><strong>Microlink:</strong> Extraction of permitted website metadata. URLs submitted for analysis may be transmitted to Microlink.</li>
              <li><strong>Platform APIs:</strong> YouTube, Pinterest, Meta or other authorised sources may receive submitted URLs or identifiers to provide accessible metadata.</li>
              <li><strong>Vercel and the backend hosting provider:</strong> Delivery of the application and its API infrastructure.</li>
            </ul>
            <p>These services process information under their own privacy notices and applicable terms. We do not claim that the services listed above are all enabled at every moment.</p>
          </section>

          <section id="pinterest">
            <h2>4. Social-media links and Pinterest</h2>
            <p>SaveLoop primarily saves <strong>references to online content</strong>, not copies of third-party videos or private posts. When you submit a Pinterest Pin or other social-media link, SaveLoop may detect the platform and request metadata only through permitted access methods.</p>
            <p>SaveLoop does not automatically import your entire Pinterest account, access private Pins without authorisation, or download and redistribute third-party media. If metadata is restricted or unavailable, SaveLoop may ask you to provide a title or category manually.</p>
            <p>Following a saved link opens the original platform, whose own privacy policy and terms apply. For information about Pinterest's practices, see <a href="https://policy.pinterest.com/en/privacy-policy" target="_blank" rel="noopener noreferrer">Pinterest's Privacy Policy <ExternalLink size={14} aria-label="external link" /></a>.</p>
          </section>

          <section id="storage">
            <h2>5. Storage, security and retention</h2>
            <p>SaveLoop uses authenticated API requests and user-scoped access controls to protect private bookmarks. Administrators may view account and aggregate usage information without automatically receiving access to individual users' private saved content.</p>
            <p>Information may be kept while your account is active or as needed to operate the service, resolve issues or meet applicable requirements. You may request deletion of your account data using the contact method below. Actual removal may require verification and may be subject to lawful retention obligations.</p>
            <p>No internet service can guarantee complete security. Please avoid placing passwords, financial credentials or other sensitive secrets inside bookmark notes or AI messages.</p>
          </section>

          <section id="choices">
            <h2>6. Your choices and requests</h2>
            <ul>
              <li>Edit or delete bookmarks and update categories or notes within SaveLoop.</li>
              <li>Choose what link details, comments and tags you submit.</li>
              <li>Use manual categorisation if you do not wish to analyse a link through a metadata service.</li>
              <li>Contact us to request access to, correction of, or deletion of your personal account data, subject to verification and applicable law.</li>
            </ul>
            <p>Logging out ends your current session; it does not by itself delete data already stored in your account.</p>
          </section>

          <section id="changes">
            <h2>7. Changes to this policy</h2>
            <p>We may update this policy when SaveLoop's features, providers or legal obligations change. The effective version will appear here with an updated date.</p>
          </section>

          <section id="contact">
            <h2>8. Contact us</h2>
            <p>For questions about this policy or requests concerning your personal information, contact the SaveLoop project operator:</p>
            {hasContact
              ? <a className="privacy-contact" href={`mailto:${PRIVACY_CONTACT_EMAIL}`}><Mail size={18} /> {PRIVACY_CONTACT_EMAIL}</a>
              : <p className="privacy-contact-placeholder"><Mail size={18} /> Privacy contact email to be provided by the SaveLoop operator before publication.</p>
            }
          </section>
        </article>
      </div>
      <div className="privacy-bottom"><ShieldCheck size={20} /><span>Save once. Find anytime. Rediscover everything.</span><Link to="/">Return home</Link></div>
    </main>
  );
}
