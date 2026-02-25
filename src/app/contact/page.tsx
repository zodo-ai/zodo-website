import styles from "./Contact.module.css";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | ZODO AI",
};

export default function Contact() {
  return (
    <main className={styles.container}>
      <div className={styles.headings}>
        <h3>CONTACT US</h3>
        <p>
          Use the form to reach out to our Team regarding any questions,
          concerns, or feedback. You can also view our FAQ for quick answers.
        </p>
      </div>

      <form className={styles.form}>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>First Name</label>
            <input type="text" placeholder="Enter First Name" />
          </div>

          <div className={styles.group}>
            <label>Last Name</label>
            <input type="text" placeholder="Enter Last Name" />
          </div>
        </div>

        <div className={styles.group}>
          <label>Email</label>
          <input type="email" placeholder="Enter Email" />
        </div>

        <div className={styles.group}>
          <label>Message</label>
          <textarea rows={5} placeholder="Enter Message" />
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" />
          <label>
            By clicking “Submit” you agree to our{" "}
            <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
            <Link href="/terms-and-conditions">Terms & Conditions</Link>.
          </label>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </main>
  );
}