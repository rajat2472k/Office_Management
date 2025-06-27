import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import './App.css'
import AdminPanel from "./pages/admin-panal"
import RegisterPage from "./pages/register"
import HomePage from "./pages/home"
import LoginPage from "./pages/login";
import ManagerPanel from "./pages/manger-panal";
import UserDashboard from "./pages/user-dashboard";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/register" element={< RegisterPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/managerpanel" element={<ManagerPanel />} />
      <Route path="/adminpanel" element={<AdminPanel/>} />
      <Route path="/userdashboard" element={<UserDashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
