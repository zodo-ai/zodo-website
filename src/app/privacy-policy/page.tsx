import styles from "./PrivacyPolicy.module.css";

export const metadata = {
  title: "Privacy Policy | PALQAR LLC",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>
          Last updated on 07-05-2025 08:54:29
        </p>

        <p>
          This Privacy Policy describes how <strong>PALQAR LLC</strong>
          ("Company", "we", "our", or "us") collects, uses, stores, and protects
          your personal information when you use our website, applications,
          software products, and services ("Services").
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>Personal information such as your name, email address, phone number, and company details.</li>
          <li>Account registration information and authentication credentials.</li>
          <li>Payment and transaction information necessary to process purchases.</li>
          <li>Device information including IP address, browser type, operating system, and device identifiers.</li>
          <li>Usage data, analytics information, cookies, and log files.</li>
          <li>Information you voluntarily provide through forms, support requests, or communications.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your information may be used to:</p>
        <ul>
          <li>Provide, operate, maintain, and improve our Services.</li>
          <li>Manage user accounts and authenticate access.</li>
          <li>Process payments and deliver purchased products or services.</li>
          <li>Respond to customer support requests and technical issues.</li>
          <li>Send service notifications, updates, and marketing communications (where permitted).</li>
          <li>Protect against fraud, abuse, and unauthorized access.</li>
          <li>Comply with applicable legal and regulatory requirements.</li>
        </ul>

        <h2>3. Sharing and Disclosure of Information</h2>
        <p>
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul>
          <li>Cloud hosting, analytics, and infrastructure providers.</li>
          <li>Payment processors to securely complete transactions.</li>
          <li>Business partners and subcontractors involved in delivering our Services.</li>
          <li>Legal authorities when required by applicable law.</li>
          <li>Professional advisors such as auditors, accountants, or legal counsel when necessary.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate administrative, technical, and organizational
          safeguards to protect your personal information from unauthorized
          access, disclosure, alteration, or destruction. However, no internet
          transmission or storage system is completely secure.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain personal information only for as long as necessary to
          provide our Services, comply with legal obligations, resolve disputes,
          enforce agreements, and protect our legitimate business interests.
        </p>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies, analytics tools, and similar technologies to improve
          website functionality, understand user behavior, personalize content,
          and enhance user experience. You may disable cookies through your
          browser settings, although certain features may become unavailable.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access your personal information.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Request deletion of your personal data where applicable.</li>
          <li>Withdraw consent for data processing.</li>
          <li>Request a copy of your personal information.</li>
          <li>Object to or restrict certain processing activities.</li>
        </ul>

        <h2>8. Third-Party Services</h2>
        <p>
          Our Services may contain links to or integrate with third-party
          websites, APIs, or platforms. We are not responsible for the privacy
          practices, security, or content of those third-party services.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our Services are not directed to individuals under the age of 18, and
          we do not knowingly collect personal information from children. If we
          become aware of such data collection, we will promptly delete the
          information.
        </p>

        <h2>10. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries
          where PALQAR LLC or its service providers operate. We take reasonable
          measures to ensure that your data receives an adequate level of
          protection consistent with applicable privacy laws.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Changes become
          effective when published on this page. Continued use of our Services
          after such updates constitutes acceptance of the revised Privacy
          Policy.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          <strong>PALQAR LLC</strong>
          <br />
          Walnut Creek, California, USA
          <br />
          Email: info@palqar.com
        </p>
      </div>
    </main>
  );
}
