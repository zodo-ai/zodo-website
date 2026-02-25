import styles from "./PrivacyPolicy.module.css";

export const metadata = {
  title: "Privacy Policy | ZODO AI",
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
          This Privacy Policy describes how <strong>ZODO HEALTH CARE PRIVATE LIMITED</strong>
          (“Company”, “we”, “our”, or “us”) collects, uses, stores, and protects
          your personal information when you use our website, applications,
          and services (“Services”).
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>Personal details such as name, email address, phone number and location.</li>
          <li>Account registration information and login credentials.</li>
          <li>Booking details and transaction information.</li>
          <li>Device information including IP address, browser type and operating system.</li>
          <li>Usage data and cookies for analytics and performance tracking.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your information may be used for the following purposes:</p>
        <ul>
          <li>To provide, operate, and improve our Services.</li>
          <li>To process transactions and send service confirmations.</li>
          <li>To respond to inquiries and provide customer support.</li>
          <li>To send updates, notifications, and promotional communications (if opted-in).</li>
          <li>To comply with legal obligations and prevent fraudulent activities.</li>
        </ul>

        <h2>3. Sharing and Disclosure of Information</h2>
        <p>
          We do not sell or rent your personal information. However, we may share
          your data with:
        </p>
        <ul>
          <li>Hospitals, doctors, or service providers to fulfill your requests.</li>
          <li>Payment gateway providers for secure transaction processing.</li>
          <li>Government authorities if required under applicable law.</li>
          <li>Third-party vendors assisting us in operating the website.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures
          to safeguard your personal information. However, no internet-based
          service can guarantee 100% security.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain personal information only for as long as necessary to
          provide Services, comply with legal requirements, resolve disputes,
          and enforce agreements.
        </p>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to improve user experience,
          analyze website traffic, and personalize content. You may disable
          cookies through your browser settings.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and review your personal data.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your data (subject to legal obligations).</li>
          <li>Withdraw consent where applicable.</li>
        </ul>

        <h2>8. Third-Party Links</h2>
        <p>
          Our website may contain links to external websites. We are not
          responsible for the privacy practices or content of such third-party websites.
        </p>

        <h2>9. Children’s Privacy</h2>
        <p>
          Our Services are not intended for individuals under the age of 18.
          We do not knowingly collect personal information from minors.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We reserve the right to update this Privacy Policy at any time.
          Continued use of our Services after changes constitutes acceptance
          of the revised policy.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          ZODO HEALTH CARE PRIVATE LIMITED<br />
          Kannur, Kerala – 673316<br />
          Email: support@zodo.ai
        </p>
      </div>
    </main>
  );
}