export default function Home() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0d1117',
      color: '#c9d1d9',
      margin: 0
    }}>
      <h1 style={{ color: '#58a6ff' }}>Shopora Containerized Environment Ready</h1>
      <p>Your Next.js app, MySQL, phpMyAdmin, Redis, and Drizzle migration stack is running successfully.</p>
    </div>
  );
}
