import './App.css'
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import ReplyBot from "./components/Replybot/Replybot.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from "./utils/PrivateRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/reply-bot"
          element={
            <PrivateRoute>
              <ReplyBot />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
