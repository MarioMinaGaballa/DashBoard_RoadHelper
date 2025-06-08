import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Send as SendIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// Mock data - TODO: Replace with API data
const mockNotificationHistory = [
  {
    id: 1,
    title: 'Emergency Alert',
    body: 'Severe weather conditions expected in your area. Please stay safe.',
    target: 'All Users',
    timestamp: '2024-02-15T10:30:00',
    status: 'Sent',
  },
  {
    id: 2,
    title: 'Service Update',
    body: 'New features available in the Road Helper app!',
    target: 'All Users',
    timestamp: '2024-02-14T15:45:00',
    status: 'Sent',
  },
  {
    id: 3,
    title: 'Maintenance Reminder',
    body: 'Time for your vehicle\'s regular maintenance check.',
    target: 'User ID: 12345',
    timestamp: '2024-02-13T09:15:00',
    status: 'Failed',
  },
];

const Notifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [customUserId, setCustomUserId] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Implement API call to send notification
      console.log('Sending notification:', {
        title,
        body,
        target: target === 'custom' ? customUserId : target,
      });

      // Reset form
      setTitle('');
      setBody('');
      setTarget('all');
      setCustomUserId('');
      setError('');
    } catch (err) {
      setError('Failed to send notification. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!title.trim() || !body.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notifications Center
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Notifications
              </Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">98.5%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4">5,678</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last 24 Hours
              </Typography>
              <Typography variant="h4">45</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Composer */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Send New Notification
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notification Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notification Body"
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={target}
                label="Target Audience"
                onChange={(e) => setTarget(e.target.value)}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="custom">Specific User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {target === 'custom' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="User ID"
                value={customUserId}
                onChange={(e) => setCustomUserId(e.target.value)}
                required
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={handlePreview}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendNotification}
              >
                Send Notification
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Notification History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification History
        </Typography>
        <List>
          {mockNotificationHistory.map((notification) => (
            <ListItem key={notification.id}>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {notification.body}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Target: {notification.target} |{' '}
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={notification.status}
                  color={notification.status === 'Sent' ? 'success' : 'error'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogTitle>Notification Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {body}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Target: {target === 'custom' ? `User ID: ${customUserId}` : 'All Users'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => {
              setPreviewOpen(false);
              handleSendNotification();
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications; 