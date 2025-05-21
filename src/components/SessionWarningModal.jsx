import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Button,
  Box,
  LinearProgress,
  Typography
} from '@mui/material';

const SessionWarningModal = ({ isOpen, onContinue, timeRemaining }) => {
  // Calculate remaining time in seconds
  const remainingSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
  
  // Calculate progress value (0-100)
  const progressValue = (remainingSeconds / 15) * 100; // Assuming 15 seconds warning period
  
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="session-timeout-title"
      aria-describedby="session-timeout-description"
    >
      <DialogTitle id="session-timeout-title" sx={{ bgcolor: '#4E6E4E', color: 'white' }}>
        Session Timeout Warning
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <DialogContentText id="session-timeout-description">
          Your session is about to expire due to inactivity. You will be automatically logged out in:
        </DialogContentText>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h4" align="center" color="primary">
            {remainingSeconds} seconds
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressValue} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4E6E4E',
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onContinue} 
          variant="contained" 
          sx={{ 
            bgcolor: '#4E6E4E', 
            '&:hover': { bgcolor: '#3A5A3A' } 
          }}
        >
          Continue Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarningModal;