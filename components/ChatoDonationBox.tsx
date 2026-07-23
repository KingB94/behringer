export default function ChatoDonationBox() {
  return (
    <>
      <hr
        className="wp-block-separator has-css-opacity"
        style={{ margin: "3rem auto" }}
      />
      <div
        className="donation-box"
        style={{
          background: "#f9f9f9",
          padding: "2rem",
          borderRadius: 8,
          borderLeft: "5px solid var(--clr-primary)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Spendenkonto</h3>
        <p>
          <strong>Empfänger:</strong> Missionsbenediktiner Münsterschwarzach
          <br />
          <strong>Bank:</strong> Liga Bank Regensburg
          <br />
          <strong>IBAN:</strong> DE51 7509 0300 0003 0150 33
          <br />
          <strong>BIC:</strong> GENODEF1MOS
          <br />
          <strong>Verwendungszweck:</strong> Mädchenschule Chato
        </p>
        <p style={{ fontSize: "0.9rem", marginBottom: 0 }}>
          <em>
            Für eine Spendenquittung geben Sie bitte im Verwendungszweck Ihre
            genaue Anschrift an.
          </em>
        </p>
      </div>
    </>
  );
}
