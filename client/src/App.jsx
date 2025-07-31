import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForms from "./components/authForm";
import ProfilePage from "./components/ProfilePage";
import AdminDashboard from "./components/adminDashboard";
import BookingPage from "./components/booking";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import HeroGeometric from "./components/homePage/HeroGeometric";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include", // sends the HTTP-only cookie
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public login/signup form */}
          <Route path="/login" element={<AuthForms />} />
          <Route
            path="/"
            element={
              <Layout>
                <HeroGeometric />
              </Layout>
            }
          />

          {/* Protected: User or Admin */}
          <Route
            element={
              <ProtectedRoute user={user} allowedRoles={["user", "admin"]} />
            }
          >
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfilePage />{" "}
                </Layout>
              }
            />
            <Route
              path="/booking"
              element={
                <Layout>
                  <BookingPage />
                </Layout>
              }
            />
          </Route>

          {/* Protected: Admin only */}
          <Route
            element={<ProtectedRoute user={user} allowedRoles={["admin"]} />}
          >
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
                }
            />
          </Route>

          {/* Optional: Unauthorized access fallback */}
          <Route path="/unauthorized" element={<div>Access Denied</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
