import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePopup = ({
  employees,
  selectedDate,
  onClose,
  onSave,
  isEditing,
  currentEmployeeId,
  currentAttendanceId,
  attendanceData,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceType, setAttendanceType] = useState('full_day_present');
  const [attendanceDate, setAttendanceDate] = useState(new Date()); // Initialize to the current date

  useEffect(() => {
    if (isEditing && currentEmployeeId && currentAttendanceId) {
      setSelectedEmployee(currentEmployeeId);
      setAttendanceType(attendanceData[currentEmployeeId][currentAttendanceId] || 'full_day_present');
      setAttendanceDate(new Date(currentAttendanceId)); // Ensure the editing date is set correctly
    } else {
      setSelectedEmployee('');
      setAttendanceType('full_day_present');
      setAttendanceDate(new Date()); // Reset to the current date when not editing
    }
  }, [isEditing, currentEmployeeId, currentAttendanceId, attendanceData]);

  const handleSave = async () => {
    if (selectedEmployee && attendanceDate) {
      const attendanceUpdate = {
        name: selectedEmployee,
        date: attendanceDate.toISOString().split('T')[0],
        status: attendanceType,
      };
      try {
        if (isEditing && currentAttendanceId) {
          await axios.put(`http://localhost:8000/attendance/${currentAttendanceId}`, attendanceUpdate, {
            withCredentials: true,
          });
        } else {
          const response = await axios.post('http://localhost:8000/attendance/', attendanceUpdate, {
            withCredentials: true,
          });
          attendanceUpdate.id = response.data.id;
        }
        onSave(attendanceUpdate.id, selectedEmployee, attendanceDate, attendanceType);
        onClose();
      } catch (error) {
        console.error('Error saving attendance:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Attendance' : 'Edit Attendance'}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee
              </label>
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={attendanceDate.toISOString().split('T')[0]}
                onChange={(e) => setAttendanceDate(new Date(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Attendance Type
              </label>
              <div className="mt-2 space-y-2">
                {['full_day_present', 'half_day_present', 'absent'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={type}
                      name="attendance-type"
                      type="radio"
                      checked={attendanceType === type}
                      onChange={() => setAttendanceType(type)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={type} className="ml-3 block text-sm font-medium text-gray-700">
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            onClick={handleSave}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePopup;