import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { label: "", inputType: "text", value: "" }]);
  };

  const saveEmployee = async () => {
    console.log(fields);
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/employee/", {
        data: fields, 
      },{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      alert('Employee Added Successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add Employee
        </h1>
        <div>
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4 mb-4"
            >
              <input
                type="text"
                placeholder="Label"
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none bg-gray-100 text-gray-700"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
              />
              <select
                className="w-1/4 px-2 py-2 border rounded-lg focus:outline-none bg-gray-100 text-gray-700"
                value={field.inputType}
                onChange={(e) =>
                  handleFieldChange(index, "inputType", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="password">Password</option>
              </select>
              <input
                type={field.inputType}
                placeholder={field.label || "Enter Value"}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none bg-gray-100 text-gray-700"
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddField}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 mb-4"
        >
          Add Field
        </button>
        <button
          onClick={saveEmployee}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 mb-4"
        >
          Save
        </button>
        <button
            type="button"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300"
            onClick={() => {
                navigate("/dashboard");
  
            }}
          >
            Home
          </button>
      </div>
    </div>
  );
};

export default AddEmployee;
