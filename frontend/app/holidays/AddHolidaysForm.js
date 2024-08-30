"use client";

import { useState } from 'react';
import { TextField, Button, IconButton, Grid } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function AddHolidays({ onClose }) {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 -ml-14 w-[650px]">
      <div className="p-4">
        <h2 className="text-2xl mb-4">Add Holiday</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} className="mb-6">
            <TextField
              fullWidth
              id="holidayName"
              label="Holiday Name"
              variant="outlined"
              placeholder="Enter holiday name"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className="mb-6">
            <TextField
              fullWidth
              id="holidayDate"
              label="Holiday Date"
              variant="outlined"
              placeholder="dd/mm/yyyy"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className="flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={onClose}
              className="mr-2"            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="mr-2"            >
              Send
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
