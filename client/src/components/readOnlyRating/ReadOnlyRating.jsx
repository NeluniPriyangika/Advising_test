import React from 'react';
import "./readOnlyRating.css";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function ReadOnlyRating() {
    const [value, setValue] = React.useState(2);

  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Rating name="read-only" value={value} readOnly />
    </Box>
  );
}

export default ReadOnlyRating
