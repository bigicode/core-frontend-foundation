import { BrowserRouter, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import useAuth from './hooks/useAuth';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/RegisterPage';
import ProfilePage from './features/auth/pages/ProfilePage';


function App(){
  const { token, user, logout } = useAuth();
  const [ isLoggedIn, setIsLoggedIb ] = useState(!!token);


  return(
<BrowserRouter>
<div className="app-container">

 <nav className="navbar">
          <div className="nav-brand">MP Platform</div>
          <div className="nav-links">
            {!token ? (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>
            ) : (
              <>
                <a href="/profile">Profile</a>
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                !token ? (
                  <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
                ) : (
                  <Navigate to="/profile" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !token ? (
                  <RegisterPage onRegisterSuccess={() => setIsLoggedIn(true)} />
                ) : (
                  <Navigate to="/profile" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                token ? (
                  <ProfilePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={<Navigate to={token ? "/profile" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;