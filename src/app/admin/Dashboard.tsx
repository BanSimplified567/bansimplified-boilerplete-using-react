import { useLogout } from '@/hooks/useLogout';

function Dashboard() {
  const logout = useLogout();
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard
