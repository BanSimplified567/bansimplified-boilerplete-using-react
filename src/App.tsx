import Dashboard from '@/app/admin/Dashboard';
import LoginAccount from '@/app/auth/LoginAccount';
import SignupForm from '@/app/auth/SignUpAccount';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAccount />} />
        <Route path="/auth/callback" element={ <LoginAccount /> } />
        <Route path="/dashboard" element={ <Dashboard /> } />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;
