import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            otp: otp,
            otp_token: localStorage.getItem('otp_token'),
        }
        try{
        const response = await axios.post('http://127.0.0.1:8000/api/verifyOTP/',data);
        console.log(response);
        
        if (response.status === 200){
            localStorage.removeItem('otp_token');
            localStorage.setItem('password_token', response.data.password_token);
            navigate('/changePassword');
        }
    }catch(e){
        setError("Invalid OTP");
        console.log(e);
        }
    }
        
  return (
    <div className="flex h-screen bg-black items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Verify OTP
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Please enter the OTP sent to your email or phone.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-gray-700 font-medium mb-2"
            >
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center tracking-widest"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Verify OTP
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
        <p className="text-gray-600 text-center mt-6">
          Didn't receive the OTP?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline font-medium"
          >
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
};

export default OTP;
