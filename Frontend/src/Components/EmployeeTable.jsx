import React, { useEffect, useState } from "react";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/employee/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setEmployees((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employee/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      window.alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      window.alert("Failed to delete employee. Please try again.");
    }
  };

  useEffect(()=>{
    const handleSearch = async ()=>{
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/search/',{text:searchText},{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            setEmployees(response.data);
        }catch(e){
            console.error("Error searching employees:",e);
        }
    }
    handleSearch()
  },[searchText])

  return (
    <div className="flex flex-col h-screen bg-black text-white items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Employees Table</h1>
      <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
        type="text"
        placeholder="Search by ID or Value"
        className="px-4 py-2 mb-6 w-full max-w-4xl rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring focus:border-blue-600"
      />
      <div className="overflow-x-auto w-full max-w-4xl">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={employees.map((e) => e.id)}>
            <table className="table-auto w-full border-collapse border border-blue-600 text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 border border-blue-600">ID</th>
                  <th className="px-4 py-2 border border-blue-600">Fields</th>
                  <th className="px-4 py-2 border border-blue-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <SortableRow
                    key={employee.id}
                    employee={employee}
                    deleteEmployee={deleteEmployee}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const SortableRow = ({ employee, deleteEmployee }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: employee.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-blue-600"
    >
      <td className="px-4 py-2 border border-blue-600">{employee.id}</td>
      <td className="px-4 py-2 border border-blue-600">
        <table className="w-full">
          <thead>
            <tr className="text-blue-600">
              <th className="px-2 py-1">Label</th>
              <th className="px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {employee.data.map((field, index) => (
              <tr key={index} className="bg-gray-800 text-white">
                <td className="px-2 py-1">{field.label}</td>
                <td className="px-2 py-1">{field.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
      <td className="px-4 py-2 border border-blue-600">
        <button
          onClick={() => {deleteEmployee(employee.id)
            console.log('delete clicked');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EmployeeTable;
