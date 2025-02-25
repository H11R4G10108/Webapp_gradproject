import './App.css'
import Login from "./components/Login/Login";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <AuthProvider>
    <Routes>
    <Route path="/login" element={<Login />} />
    </Routes>
    </AuthProvider>
    )
}

export default App
