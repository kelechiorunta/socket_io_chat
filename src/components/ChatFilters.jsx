import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';

export default function ChatFilters({ handleSort, isDark }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState('all');

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
      fontSize={14}
      bgcolor={isDark ? 'grey.900' : 'white'}
      color={isDark && 'white'}
    >
      {/* Filter */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Filter</InputLabel>
        <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="unread">Unread</MenuItem>
          <MenuItem value="online">Online</MenuItem>
        </Select>
      </FormControl>

      {/* Sort */}
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Sort</InputLabel>
        <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </FormControl>

      {/* Tabs replacement */}
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>View</InputLabel>
        <Select
          value={tab}
          label="View"
          onChange={(e) => {
            setTab(e.target.value);
            if (e.target.value === 'contacts') {
              handleSort();
            }
          }}
        >
          <MenuItem value="all">All Chats</MenuItem>
          <MenuItem value="groups">Groups</MenuItem>
          <MenuItem value="contacts">Contacts</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
