import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { setCredentials, logout as logoutAction } from "./store/authSlice";
import ActivityDetail from "./components/ActivityDetail";
import "../src/index.css";
import ActivityForm from "./components/ActivityForm";

function App() {
  const { token, tokenData, logIn, logOut, loginInProgress } =
    useContext(AuthContext);

  const dispatch = useDispatch();
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
    } else {
      dispatch(logoutAction());
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
    logOut();
  };

  if (loginInProgress) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="login-page d-flex align-items-center justify-content-center vh-100">
        <div className="card border-0 shadow-lg login-card">
          <div className="text-center mb-4">
            <i className="bi bi-activity text-primary display-4"></i>
            <h3 className="fw-bold mt-2 mb-1">Fitness Tracker</h3>
            <p className="text-muted mb-0">Sign in to continue</p>
          </div>
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => logIn()}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Log in
          </button>
          <p className="text-center text-muted small mt-4 mb-0">
            Secured by Keycloak
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-semibold">
            <i className="bi bi-activity text-primary me-2"></i>Fitness Tracker
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-light small">
              {tokenData?.preferred_username || tokenData?.email}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <Routes>
          <Route path="/activities" element={<div>Activitiespage</div>} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<ActivityForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
