import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit =  async (e)=>{
        e.preventDefault();
        if(newPassword!==confirmPassword){
            setError('Passwords do not match');
            return;
        }
        const data = {
            new_password: newPassword,
            confirm_password: confirmPassword,
            password_token: localStorage.getItem('password_token')
        }
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/changePassword/',data);
            if(response.status===200){
                localStorage.removeItem('passwords_token');
                alert('Password changed successfully');
                navigate('/');
            }
        }catch(e){
            setError(error.response.data.error);
        }

    }
  return (
    <div className="flex h-screen bg-black items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create New Password
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter a new password to reset your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>
        <p className="text-gray-600 text-center mt-6">
          Remembered your password?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
