import React from 'react';
import Lottie from 'lottie-react';
import { Box, Typography } from '@mui/material';

// Import the local animation file
import loadingAnimation from '../../assets/animations/loading-animation.json';

const LoadingAnimation = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Box sx={{ width: '200px', height: '200px' }}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: (theme) => theme.palette.primary.main,
          fontWeight: 'medium',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingAnimation;
