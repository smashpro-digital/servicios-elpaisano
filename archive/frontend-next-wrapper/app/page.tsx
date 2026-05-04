const HOME_URL = "https://servicioselpaisano.com";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      <iframe
        src={HOME_URL}
        title="Servicios El Paisano"
        style={{
          width: "100%",
          height: "100vh",
          border: 0,
          display: "block",
        }}
      />
    </main>
  );
}
