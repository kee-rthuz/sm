
'use client'
import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import FixedHeader from '../components/Header';
import AddHolidays from './AddHolidaysForm';

const holidays = [
  { id: '01', day: 'Tuesday', date: 'January 26, 2021', name: 'Republic Day' },
  { id: '02', day: 'Friday', date: 'April 2, 2021', name: 'Good Friday' },
  // Add more holidays here...
];

const HolidayList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Holidays</h1>
        <button 
          className="bg-purple-900 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={openModal}
        >
          + Add Holidays
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="mr-2">Show</span>
            <select className="border rounded px-2 py-1">
              <option>10</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <input type="text" placeholder="Search:" className="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        {/* Mobile view: Cards */}
        <div className="sm:hidden">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="border-b p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-red-500">#{holiday.id}</span>
                <div className="flex space-x-2">
                  <button className="text-green-500"><Pencil size={16} /></button>
                  <button className="text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <p><span className="font-semibold">Day:</span> <span className="text-red-500">{holiday.day}</span></p>
              <p><span className="font-semibold">Date:</span> <span className="text-red-500">{holiday.date}</span></p>
              <p><span className="font-semibold">Name:</span> <span className="text-red-500">{holiday.name}</span></p>
            </div>
          ))}
        </div>

        {/* Desktop view: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">HOLIDAY DAY</th>
                <th className="border p-2 text-left">HOLIDAY DATE</th>
                <th className="border p-2 text-left">HOLIDAY NAME</th>
                <th className="border p-2 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-red-500">{holiday.id}</td>
                  <td className="border p-2 text-red-500">{holiday.day}</td>
                  <td className="border p-2 text-red-500">{holiday.date}</td>
                  <td className="border p-2 text-red-500">{holiday.name}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <button className="text-green-500"><Pencil size={16} /></button>
                      <button className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
          <span className="mb-2 sm:mb-0">Showing 1 to {holidays.length} of {holidays.length} entries</span>
          <div className="space-x-2">
            {/* Pagination controls can be added here */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <AddHolidays onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayList;