import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const LeaveApplicationForm = ({ onClose }) => {
  const [selectedLeave, setSelectedLeave] = useState('Medical Leave');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [description, setDescription] = useState('');

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 -ml-14 w-[650px]">
      <div className="p-4   ">
        <h2 className="text-xl mb-10">Leave Add</h2>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Select Leave Type</InputLabel>
              <Select
                value={selectedLeave}
                onChange={(e) => setSelectedLeave(e.target.value)}
                label="Select Leave Type"
                required
              >
                <MenuItem value="Medical Leave">Medical Leave</MenuItem>
                <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Leave From Date"
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Leave to Date"
                value={toDate}
                onChange={(date) => setToDate(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description (optional)"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} className="flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="mr-2"
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;