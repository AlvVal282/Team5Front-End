'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  const theme = useTheme(); // Access theme colors and typography

  const menuItems = [
    { title: 'Search', url: '/books/retrieve', color: 'primary' },
    { title: 'Create', url: '/books/create', color: 'primary' },
    { title: 'Delete', url: '/books/delete', color: 'error' } // Use 'error' for Delete button
  ];

  return (
    <MainCard
      title="Welcome to the Library App"
      sx={{
        boxShadow: 3,
        padding: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {/* Header */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: theme.typography.h3.fontWeight,
            fontFamily: theme.typography.fontFamily,
            mb: 2,
            color: theme.palette.primary.main
          }}
        >
          Explore, Manage, and Organize Your Books!
        </Typography>
        {/* Content Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Text Section */}
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              pr: { md: 4 },
              mb: { xs: 2, md: 0 },
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: theme.palette.text.secondary
              }}
            >
              This library application is designed to help you efficiently manage your book collection. Whether you're an avid reader, a
              researcher, or simply someone who loves books, this app provides an easy and intuitive way to organize your library.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}
          >
            <img
              src="/assets/images/home.jpg"
              alt="Book Image"
              style={{
                maxWidth: '400px',
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: theme.shadows[4]
              }}
            />
          </Box>
        </Box>
        {/* Navigation Buttons */}
        <Stack spacing={2} direction="row" justifyContent="center" sx={{ mb: 4 }}>
          {menuItems.map((item) => (
            <Link key={item.title} href={item.url} passHref legacyBehavior>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette[item.color].main,
                  color: theme.palette[item.color].contrastText,
                  fontSize: '1rem',
                  padding: '8px 24px',
                  borderRadius: '24px',
                  textTransform: 'capitalize',
                  '&:hover': {
                    backgroundColor: theme.palette[item.color].dark
                  }
                }}
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </Stack>
        {/* Feature List */}
        <Typography
          variant="body2"
          component="ul"
          sx={{
            textAlign: 'left',
            display: 'inline-block',
            lineHeight: 1.6,
            color: theme.palette.text.primary
          }}
        >
          <li>
            <strong>Create:</strong> Add new books to your library collection with details like title, author(s), category, and more.
          </li>
          <li>
            <strong>Search:</strong> Quickly find books by title, author, or category using the search functionality.
          </li>
          <li>
            <strong>Delete:</strong> Remove books from your collection that are no longer needed or relevant.
          </li>
        </Typography>
      </Box>
    </MainCard>
  );
}
