
'use client'
import React, { useState } from 'react';
import FixedHeader from '../components/Header';
import LeaveApplicationForm from '../leaverequest/LeaveAddForm';
import { Check, X, Trash2 } from 'lucide-react';

const leaveData = [
  { id: '#EMP : 00001', name: 'Joan Dyer', type: 'Casual Leave', from: '12/03/2021', to: '14/03/2021', reason: 'Going to Holiday' },
  { id: '#EMP : 00002', name: 'Sally Graham', type: 'Medical Leave', from: '01/05/2021', to: '06/05/2021', reason: 'Hospital Admit' },
  // Add more data as needed
];

const LeaveRequestTable = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Leave Request</h1>
        <button 
          className="bg-purple-900 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={toggleForm}
        >
          Add Leave
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <LeaveApplicationForm onClose={toggleForm} />
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="mr-2">Show</span>
            <select className="border rounded p-1">
              <option>10</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <input type="text" placeholder="Search" className="border rounded p-1 w-full" />
          </div>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {leaveData.map((leave) => (
            <div key={leave.id} className="border-b p-4">
              <div className="flex items-center mb-2">
                <img src="/api/placeholder/30/30" alt={leave.name} className="w-8 h-8 rounded-full mr-2" />
                <span className="font-medium">{leave.name}</span>
              </div>
              <p className="text-sm text-red-500 mb-1">{leave.id}</p>
              <p className="text-sm mb-1"><span className="font-medium">Type:</span> {leave.type}</p>
              <p className="text-sm mb-1"><span className="font-medium">From:</span> {leave.from}</p>
              <p className="text-sm mb-1"><span className="font-medium">To:</span> {leave.to}</p>
              <p className="text-sm mb-2"><span className="font-medium">Reason:</span> {leave.reason}</p>
              <div className="flex justify-end">
                <button className="text-green-600 hover:text-green-900 mr-4">
                  <Check size={20} />
                </button>
                <button className="text-red-600 hover:text-red-900 mr-4">
                  <X size={20} />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEAVE TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FROM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REASON</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveData.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{leave.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src="/api/placeholder/30/30" alt={leave.name} className="w-8 h-8 rounded-full mr-2" />
                      <span className="text-sm font-medium text-gray-900">{leave.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-2">
                      <Check size={20} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 mr-2">
                      <X size={20} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestTable;