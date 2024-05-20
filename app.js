
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";
import LoginPage from "./components/loginPage";
import SuperAdmin from "./components/SuperAdmin";
import Instituteadmin from "./components/InstituteAdmin";
import StudentHome from "./components/StudentHome";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/superadmin" Component={SuperAdmin}></Route>
        <Route path="/instituteadmin" Component={Instituteadmin}></Route>
        <Route path="/student" Component={StudentHome}></Route>
      </Routes>
    </Router>
  );
}

export default App;