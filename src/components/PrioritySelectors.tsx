import React, { ReactNode, useState } from 'react';
import { MenuItem, Select, InputLabel, FormControl, Stack, SelectChangeEvent } from '@mui/material';

export default function PrioritySelectors({
  initialValue,
  onChange
}: {
  initialValue: number;
  onChange: (event: SelectChangeEvent<number>) => void;
}) {
    return (
    <Stack spacing={4}>
      <FormControl fullWidth>
        <InputLabel id="priority-selector-label">Select a Search Type</InputLabel>
        <Select
          labelId="priority-selector-label"
          value={initialValue} 
          onChange={onChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value={0} disabled>
            Select a Search Type
          </MenuItem>
          <MenuItem value={1}>ISBN</MenuItem>
          <MenuItem value={2}>Author</MenuItem>
          <MenuItem value={3}>Title</MenuItem>
          <MenuItem value={4}>Rating</MenuItem>
          <MenuItem value={5}>All Books</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
