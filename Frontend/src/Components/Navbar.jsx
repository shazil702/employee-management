import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
      return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">
          Employee Portal
        </div>
        <div className="flex space-x-4">
          <button onClick={() =>navigate('/addEmployee')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Add Employee
          </button>
          <button onClick={()=>navigate('/profile')}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
