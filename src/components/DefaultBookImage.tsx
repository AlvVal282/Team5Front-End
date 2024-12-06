import React from 'react';
import { Box } from '@mui/material';
//import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LibraryBooksIcon from '@mui/icons-material/ImportContacts';


interface DefaultBookImageProps {
  imageUrl: string | null;
  width?: number;
  height?: number;
}

export const DefaultBookImage: React.FC<DefaultBookImageProps> = ({
  imageUrl,
  width = 200,
  height = 300,
}) => (
  <Box
    sx={{
      width,
      height,
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: imageUrl ? 'transparent' : '#e0e0e0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="Book Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    ) : (
      <LibraryBooksIcon sx={{ fontSize: 80, color: '#9e9e9e' }} />
    )}
  </Box>
);
