import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard'
import UserTransactions from './components/UserTransactions';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/user-transactions" element={<UserTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
