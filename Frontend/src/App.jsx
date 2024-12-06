import { BrowserRouter, Route,Routes } from "react-router-dom"
import Login from "./Components/Login"
import Register from "./Components/Register"
import OTP from "./Components/OTP"
import ChangePassword from "./Components/ChangePassword"
import Dashboard from "./Components/Dashboard"
import Profile from "./Components/Profile"
import AddEmployee from "./Components/AddEmployee"

function App() {

  return (
 <BrowserRouter>
 <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register/>} />
  <Route path="/otp" element={<OTP/>}/>
  <Route path="/changePassword" element={<ChangePassword/>} />
  <Route path="/dashboard" element={<Dashboard/>}/>
  <Route path="/profile" element={<Profile/>}/>
  <Route path="/addEmployee" element={<AddEmployee/>}/>
 </Routes>
 </BrowserRouter>
  )
}

export default App
