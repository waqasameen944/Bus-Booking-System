import { BrowserRouter, Routes, Route } from "react-router"; // Import Routes and Route
import AuthForms from "./components/authForm";
import ProfilePage from "./components/ProfilePage"; // Import the new ProfilePage
import { Toaster } from "sonner";
import AdminDashboard from "./components/adminDashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<AuthForms />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          {/* You can add more routes here */}
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
