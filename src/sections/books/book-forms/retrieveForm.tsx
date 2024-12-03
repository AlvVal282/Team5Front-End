"use client";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Card, CardContent, TextField, Button, Select, MenuItem, Stack } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { pages } from 'views/books/retrieve' ;
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

 export default function Search() {
    const [selectedOption, setSelectedOption] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const router = useRouter();

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        setInputValue('');
    };
    const handleSearch = () => {
        if (selectedOption && inputValue.trim()) {
            const url = pages.children.find((child) => child.id === selectedOption)?.url.replace(':random', inputValue);
            if (url){
                router.push(url);
            }
            } else {
            console.error('url is undefined.');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px' }}>
              <BookIcon sx={{ fontSize: '50px', color: '#007BFF', marginCenter: '15px' }} />
              <Typography variant="h5" component="h1">
                Search Page
              </Typography>
            </Box>
    
            {/* Main Card Section */}
            <Card sx={{ maxWidth: 800, margin: '0 auto', padding: '20px', boxShadow: 3 }}>
              <CardContent>
                {/* Title */}
                <Typography variant="h5" component="h2" gutterBottom>
                  Find a Book
                </Typography>
    
                {/* Dropdown, Input, and Search Button */}
                <Stack spacing={4}>
                  {/* Dropdown Menu */}
                  <Select
                    value={selectedOption}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select a Search Type
                    </MenuItem>
                    {pages.children.map((child) => (
                      <MenuItem key={child.id} value={child.id}>
                        {child.title}
                      </MenuItem>
                    ))}
                  </Select>
    
                  {/* Input Box */}
                  <TextField
                    label={selectedOption ? `Enter ${selectedOption}` : 'Enter a value'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    fullWidth
                    disabled={!selectedOption}
                  />
    
                  {/* Search Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={!selectedOption || !inputValue.trim()}
                  >
                    Search
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </ThemeProvider>
      );
    }