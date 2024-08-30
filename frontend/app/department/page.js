

import React from 'react';
import { Pencil, Trash2, UserCircle2 } from 'lucide-react';
import FixedHeader from '../components/Header';

const departmentsData = [
  { id: 1, head: 'Joan Dyer', name: 'Web Development', employees: 40 },
  { id: 2, head: 'Ryan Randall', name: 'Accounts', employees: 48 },
  { id: 3, head: 'Phil Glover', name: 'Support', employees: 15 },
  { id: 4, head: 'Victor Rampling', name: 'App Development', employees: 39 },
  { id: 5, head: 'Sally Graham', name: 'Recruiter', employees: 12 },
  { id: 6, head: 'Robert Anderson', name: 'Admin', employees: 8 },
];

const DepartmentsTable = () => {
  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button className="bg-purple-900 text-white px-4 py-2 rounded">
          Add Departments
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center ml-4 mt-4">
          <span className="mr-2">Show</span>
          <select className="border rounded p-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
        <div className="mr-4 mt-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded p-1"
          />
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">#</th>
            <th className="py-3 px-6 text-left">DEPARTMENT HEAD</th>
            <th className="py-3 px-6 text-left">DEPARTMENT NAME</th>
            <th className="py-3 px-6 text-left">EMPLOYEE UNDERWORK</th>
            <th className="py-3 px-6 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {departmentsData.map((dept) => (
            <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{dept.id}</td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <UserCircle2 className="mr-2 h-8 w-8 text-gray-400" />
                  {dept.head}
                </div>
              </td>
              <td className="py-3 px-6 text-left">{dept.name}</td>
              <td className="py-3 px-6 text-left">{dept.employees}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex justify-center space-x-2">
                  <button className="text-green-500 hover:text-green-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default DepartmentsTable;