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
      sx={{
        mb: 2,
        fontSize: 14,
        bgcolor: isDark ? 'grey.900' : 'grey.50',
        color: isDark ? 'grey.100' : 'grey.900',
        border: 1,
        borderColor: isDark ? 'grey.700' : 'grey.300',
        borderRadius: 2,
        p: 1.5
      }}
    >
      {/* Filter */}
      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: 100,
          '& .MuiOutlinedInput-root': {
            color: isDark ? 'grey.100' : 'grey.900',
            bgcolor: isDark ? 'grey.800' : 'white',
            '& fieldset': {
              borderColor: isDark ? 'grey.600' : 'grey.300'
            },
            '&:hover fieldset': {
              borderColor: isDark ? 'grey.400' : 'grey.500'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? 'grey.300' : 'grey.700'
          }
        }}
      >
        <InputLabel>Filter</InputLabel>
        <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="unread">Unread</MenuItem>
          <MenuItem value="online">Online</MenuItem>
        </Select>
      </FormControl>

      {/* Sort */}
      <FormControl
        size="small"
        sx={{
          minWidth: 100,
          '& .MuiOutlinedInput-root': {
            color: isDark ? 'grey.100' : 'grey.900',
            bgcolor: isDark ? 'grey.800' : 'white',
            '& fieldset': {
              borderColor: isDark ? 'grey.600' : 'grey.300'
            },
            '&:hover fieldset': {
              borderColor: isDark ? 'grey.400' : 'grey.500'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? 'grey.300' : 'grey.700'
          }
        }}
      >
        <InputLabel>Sort</InputLabel>
        <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </FormControl>

      {/* View */}
      <FormControl
        size="small"
        sx={{
          minWidth: 100,
          '& .MuiOutlinedInput-root': {
            color: isDark ? 'grey.100' : 'grey.900',
            bgcolor: isDark ? 'grey.800' : 'white',
            '& fieldset': {
              borderColor: isDark ? 'grey.600' : 'grey.300'
            },
            '&:hover fieldset': {
              borderColor: isDark ? 'grey.400' : 'grey.500'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? 'grey.300' : 'grey.700'
          }
        }}
      >
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
