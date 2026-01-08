export default function AuthSuccessPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Google Connected Successfully</h1>
      <p>Your Google account is now linked.</p>

      <p>Next step: Create calendar events via API.</p>

      <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
        POST /api/calendar/create
      </pre>
    </div>
  );
}
