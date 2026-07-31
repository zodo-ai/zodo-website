import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms & Conditions | PALQAR LLC",
};

export default function Terms() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.updated}>
          Last updated on 07-05-2025 08:54:29
        </p>

        <p className={styles.paragraph}>
          These Terms and Conditions, along with our Privacy Policy and other
          applicable policies ("Terms"), constitute a legally binding agreement
          between <strong>PALQAR LLC</strong> ("Company", "Website Owner", "we",
          "us", or "our") and you ("User", "you", or "your") governing your
          access to and use of our website, applications, products, and services
          (collectively, the "Services").
        </p>

        <p className={styles.paragraph}>
          By accessing or using our Services, you acknowledge that you have
          read, understood, and agreed to be bound by these Terms. If you do
          not agree, you must discontinue use immediately.
        </p>

        <h2 className={styles.sectionTitle}>1. Eligibility</h2>
        <p className={styles.paragraph}>
          You must be at least 18 years of age and legally capable of entering
          into legally binding agreements under applicable laws.
        </p>

        <h2 className={styles.sectionTitle}>2. Account Registration</h2>
        <ul className={styles.list}>
          <li>
            You agree to provide accurate, complete, and updated information.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </li>
          <li>
            You accept responsibility for all activities conducted under your
            account.
          </li>
        </ul>

        <h2 className={styles.sectionTitle}>3. Services Description</h2>
        <p className={styles.paragraph}>
          PALQAR LLC provides technology services, including software
          development, SaaS platforms, web and mobile applications, AI-powered
          solutions, cloud infrastructure, digital transformation services, and
          related technology products. We reserve the right to modify, suspend,
          or discontinue any part of the Services at any time without prior
          notice.
        </p>

        <h2 className={styles.sectionTitle}>4. User Obligations</h2>
        <ul className={styles.list}>
          <li>Not use the Services for unlawful or fraudulent purposes.</li>
          <li>Not interfere with website security or system integrity.</li>
          <li>
            Not attempt unauthorized access to our systems, servers, or data.
          </li>
          <li>Comply with all applicable laws and regulations.</li>
        </ul>

        <h2 className={styles.sectionTitle}>5. Payments & Refund Policy</h2>
        <ul className={styles.list}>
          <li>You agree to pay all charges applicable to the Services used.</li>
          <li>
            Refunds are processed only where required by law or if Services
            cannot be delivered.
          </li>
          <li>
            Refund requests must be submitted within the applicable refund
            period.
          </li>
          <li>
            Refund processing timelines are subject to our internal policies and
            payment provider procedures.
          </li>
        </ul>

        <h2 className={styles.sectionTitle}>
          6. Intellectual Property Rights
        </h2>
        <p className={styles.paragraph}>
          All content, trademarks, logos, software, source code, graphics,
          designs, documentation, and other intellectual property displayed or
          provided through the Services are owned by PALQAR LLC or its licensors.
          Unauthorized copying, modification, distribution, reverse
          engineering, or commercial use is strictly prohibited.
        </p>

        <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
        <p className={styles.paragraph}>
          The Company makes no warranties regarding the uninterrupted
          availability, accuracy, or completeness of the Services. Your use of
          the Services is entirely at your own risk. To the fullest extent
          permitted by applicable law, PALQAR LLC shall not be liable for any
          indirect, incidental, consequential, special, or punitive damages.
        </p>

        <h2 className={styles.sectionTitle}>8. Third-Party Services</h2>
        <p className={styles.paragraph}>
          Our Services may integrate with or contain links to third-party
          websites, APIs, or services. PALQAR LLC is not responsible for the
          content, security, privacy practices, or availability of such
          third-party services.
        </p>

        <h2 className={styles.sectionTitle}>9. Force Majeure</h2>
        <p className={styles.paragraph}>
          Neither party shall be liable for delays or failures caused by events
          beyond reasonable control, including natural disasters, government
          actions, internet outages, cyber-attacks, labor disputes, pandemics,
          or technical failures.
        </p>

        <h2 className={styles.sectionTitle}>10. Indemnification</h2>
        <p className={styles.paragraph}>
          You agree to indemnify, defend, and hold harmless PALQAR LLC, its
          directors, employees, partners, and affiliates against any claims,
          liabilities, damages, costs, and expenses arising from your use of the
          Services or violation of these Terms.
        </p>

        <h2 className={styles.sectionTitle}>11. Termination</h2>
        <p className={styles.paragraph}>
          We reserve the right to suspend, restrict, or terminate your access to
          the Services immediately, with or without notice, if you violate these
          Terms or engage in activities that may harm the Company or other
          users.
        </p>

        <h2 className={styles.sectionTitle}>
          12. Governing Law & Jurisdiction
        </h2>
        <p className={styles.paragraph}>
          These Terms shall be governed by and interpreted in accordance with
          the applicable laws governing PALQAR LLC. Any disputes arising from
          these Terms shall be subject to the exclusive jurisdiction of the
          competent courts where PALQAR LLC maintains its principal place of
          business, unless otherwise required by applicable law.
        </p>

        <h2 className={styles.sectionTitle}>13. Changes to Terms</h2>
        <p className={styles.paragraph}>
          PALQAR LLC reserves the right to modify these Terms at any time.
          Updated versions will become effective upon publication on our
          website. Continued use of the Services constitutes acceptance of the
          revised Terms.
        </p>

        <h2 className={styles.sectionTitle}>14. Contact Information</h2>
        <p className={styles.paragraph}>
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
