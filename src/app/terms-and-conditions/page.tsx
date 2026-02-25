import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms & Conditions | ZODO AI",
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
          These Terms and Conditions, along with our Privacy Policy and other applicable
          policies (“Terms”), constitute a legally binding agreement between
          <strong> ZODO HEALTH CARE PRIVATE LIMITED </strong>
          (“Company”, “Website Owner”, “we”, “us”, or “our”) and you (“User”, “you”, or “your”)
          governing your access to and use of our website, applications, products,
          and services (collectively, the “Services”).
        </p>

        <p className={styles.paragraph}>
          By accessing or using our Services, you acknowledge that you have read,
          understood, and agreed to be bound by these Terms. If you do not agree,
          you must discontinue use immediately.
        </p>

        <h2 className={styles.sectionTitle}>1. Eligibility</h2>
        <p className={styles.paragraph}>
          You must be at least 18 years of age and legally capable of entering
          into binding agreements under applicable laws of India.
        </p>

        <h2 className={styles.sectionTitle}>2. Account Registration</h2>
        <ul className={styles.list}>
          <li>You agree to provide accurate, complete, and updated information.</li>
          <li>You are responsible for maintaining confidentiality of login credentials.</li>
          <li>You accept responsibility for all activities under your account.</li>
        </ul>

        <h2 className={styles.sectionTitle}>3. Services Description</h2>
        <p className={styles.paragraph}>
          ZODO HEALTH CARE PRIVATE LIMITED provides digital healthcare-related
          technology services including hospital onboarding, appointment facilitation,
          and SaaS-based healthcare solutions. We reserve the right to modify,
          suspend, or discontinue Services without prior notice.
        </p>

        <h2 className={styles.sectionTitle}>4. User Obligations</h2>
        <ul className={styles.list}>
          <li>Not use the Services for unlawful or fraudulent purposes.</li>
          <li>Not interfere with website security or system integrity.</li>
          <li>Not attempt unauthorized access to systems or data.</li>
          <li>Comply with all applicable Indian laws and regulations.</li>
        </ul>

        <h2 className={styles.sectionTitle}>5. Payments & Refund Policy</h2>
        <ul className={styles.list}>
          <li>You agree to pay all charges applicable to Services availed.</li>
          <li>Refunds are processed only if Services cannot be delivered.</li>
          <li>Refund requests must be raised within the specified time.</li>
          <li>Refund timelines follow applicable company policies.</li>
        </ul>

        <h2 className={styles.sectionTitle}>6. Intellectual Property Rights</h2>
        <p className={styles.paragraph}>
          All content, trademarks, logos, graphics, software, and design elements
          on the website are owned by ZODO HEALTH CARE PRIVATE LIMITED.
          Unauthorized copying, distribution, or commercial use is strictly prohibited.
        </p>

        <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
        <p className={styles.paragraph}>
          The Company makes no warranties regarding the accuracy or completeness
          of the Services. Your use is at your own risk. To the maximum extent
          permitted by law, we shall not be liable for indirect, incidental,
          special, or consequential damages.
        </p>

        <h2 className={styles.sectionTitle}>8. Third-Party Links</h2>
        <p className={styles.paragraph}>
          Our website may contain links to third-party websites. We are not
          responsible for their content, policies, or practices.
        </p>

        <h2 className={styles.sectionTitle}>9. Force Majeure</h2>
        <p className={styles.paragraph}>
          Neither party shall be liable for failure or delay in performance due
          to events beyond reasonable control including natural disasters,
          government actions, technical failures, or similar events.
        </p>

        <h2 className={styles.sectionTitle}>10. Indemnification</h2>
        <p className={styles.paragraph}>
          You agree to indemnify and hold harmless the Company from any claims,
          liabilities, damages, losses, or expenses arising from your misuse
          of the Services or violation of these Terms.
        </p>

        <h2 className={styles.sectionTitle}>11. Termination</h2>
        <p className={styles.paragraph}>
          We reserve the right to suspend or terminate your access to the Services
          at our sole discretion without prior notice if you violate these Terms.
        </p>

        <h2 className={styles.sectionTitle}>12. Governing Law & Jurisdiction</h2>
        <p className={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with
          the laws of India. All disputes shall be subject to the exclusive
          jurisdiction of the courts in Kannur, Kerala.
        </p>

        <h2 className={styles.sectionTitle}>13. Changes to Terms</h2>
        <p className={styles.paragraph}>
          We may revise these Terms at any time without prior notice.
          Continued use of the Services constitutes acceptance of updated Terms.
        </p>

        <h2 className={styles.sectionTitle}>14. Contact Information</h2>
        <p>
          ZODO HEALTH CARE PRIVATE LIMITED<br />
          Kannur, Kerala – 673316<br />
          Email: support@zodo.ai
        </p>
      </div>
    </main>
  );
}