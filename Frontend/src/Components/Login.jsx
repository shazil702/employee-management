import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const sendOtp = async (e) => {
        e.preventDefault();
        if (email !== ''){

        try{
            const response = await axios.post('http://127.0.0.1:8000/api/sendOTP/',{email:email})
            localStorage.setItem('otp_token', response.data.otp_token)
            navigate('/otp')
        }
        catch(error){
            setError("This email is not registered");
        }
    }
    else{
        setError('Please enter your email address');
    }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email: email,
            password: password
        };
        try{
            const {data} = await axios.post('http://127.0.0.1:8000/api/login/',user)
            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            navigate('/dashboard');
        }
        catch(error){
            setError(error.response.data.detail);
        }
    }
  return (
    <div className="flex h-screen bg-black items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Log in to your account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between mb-4 float-end">
            <p onClick={sendOtp}
              className="cursor-pointer text-blue-600 hover:underline text-sm font-medium"
            >
              Forgot Password?
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
        <p className="text-gray-600 text-center mt-6">
          Don't have an account?{" "}
          <Link to={'/register'}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
