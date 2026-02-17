import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import { ChatProvider } from "./context/ChatProvider";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/chat/:sessionId?"
        element={
          <ChatProvider>
            <ChatPage />
          </ChatProvider>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  );
}

export default App;
