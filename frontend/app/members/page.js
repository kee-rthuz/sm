"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import FixedHeader from '../components/Header';

const EmployeeCard = ({ name, role, email, created_at, id, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex">
    <div className="mr-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-semibold">{name}</h3>
      <span className={`inline-block px-2 py-1 text-sm rounded ${role === 'UI/UX Designer' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'}`}>
        {role}
      </span>
      <p className="mt-2 text-sm text-gray-600">Email: {email}</p>
      <p className="mt-2 text-sm text-gray-600">Created at: {new Date(created_at).toLocaleString()}</p>
      <div className="mt-4 space-x-2">
        <button className="px-3 py-1 bg-purple-900 text-white rounded-md text-sm" onClick={onEdit}>
          Edit
        </button>
        <button className="px-3 py-1 bg-red-900 text-white rounded-md text-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/employees', {
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      setFormVisible(false);
      setFormData({ name: '', role: '', email: '' });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleEditEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Include credentials
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedEmployee = await response.json();
      setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
      setFormVisible(false);
      setFormData({ name: '', role: '', email: '' });
      setEditMode(false);
      setEditId(null);
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Failed to edit employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleFormSubmit = () => {
    if (editMode) {
      handleEditEmployee(editId);
    } else {
      handleAddEmployee();
    }
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee</h2>
        <div className="flex ml-4 space-x-2">
          <button className="px-3 py-1 bg-purple-900 text-white rounded-md" onClick={() => setFormVisible(true)}>
            <span className="flex items-center">
              <UserPlus size={16} className="mr-1" />
              Add Employee
            </span>
          </button>
        </div>
      </div>
      {formVisible && (
  <div className="mb-4 flex flex-wrap items-end">
    <div className="flex-grow flex flex-wrap gap-2 mb-2 sm:mb-0">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 flex-grow"
      />
      <input
        type="text"
        placeholder="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="border p-2 flex-grow"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 flex-grow"
      />
    </div>
    <div className="flex gap-2 ml-16 mb-1 mr-20 sm:mt-0">
      <button 
        className="px-3 py-1 bg-purple-900 text-white rounded-md whitespace-nowrap" 
        onClick={handleFormSubmit}
      >
        {editMode ? 'Update' : 'Add'}
      </button>
      <button 
        className="px-3 py-1 bg-red-900 text-white rounded-md whitespace-nowrap" 
        onClick={() => setFormVisible(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(employee => (
          <EmployeeCard
            key={employee.id}
            name={employee.name}
            role={employee.role}
            email={employee.email}
            created_at={employee.created_at}
            id={employee.id}
            onEdit={() => {
              setFormData(employee);
              setEditMode(true);
              setEditId(employee.id);
              setFormVisible(true);
            }}
            onDelete={() => handleDeleteEmployee(employee.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;