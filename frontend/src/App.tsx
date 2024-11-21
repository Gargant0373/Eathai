import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Admin from './pages/Admin';
import CreateFood from './pages/CreateFood';
import "./styles/index.css";
import PlaceOrder from './pages/PlaceOrder';
import ViewOrder from './pages/ViewOrder';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/create-food" element={<CreateFood />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/order/place/:id" element={<PlaceOrder />} />
        <Route path="/order/view/:id" element={<ViewOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
