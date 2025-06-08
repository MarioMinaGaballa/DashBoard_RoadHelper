import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Person as UserIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
} from '@mui/icons-material';

// Mock data - TODO: Replace with API data
const mockChatSessions = [
  {
    id: 1,
    timestamp: '2024-02-15T10:30:00',
    userQuery: {
      type: 'text',
      content: 'How do I change a flat tire?',
    },
    aiResponse: {
      content: 'Here are the steps to change a flat tire:\n1. Find a safe location\n2. Apply the parking brake\n3. Loosen the lug nuts\n4. Jack up the car\n5. Remove the flat tire\n6. Install the spare tire\n7. Lower the car\n8. Tighten the lug nuts',
    },
  },
  {
    id: 2,
    timestamp: '2024-02-15T11:45:00',
    userQuery: {
      type: 'image',
      content: 'Image of car engine',
    },
    aiResponse: {
      content: 'Based on the image, it appears there might be a coolant leak. I recommend checking the radiator hoses and coolant reservoir for any visible damage or leaks.',
    },
  },
  // Add more mock data as needed
];

const AIChat: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = mockChatSessions.filter((session) =>
    session.userQuery.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.aiResponse.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQueryIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'text':
        return <TextIcon />;
      default:
        return <TextIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Chat Monitoring
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Interactions
              </Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Image Queries
              </Typography>
              <Typography variant="h4">456</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Text Queries
              </Typography>
              <Typography variant="h4">778</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Response Time
              </Typography>
              <Typography variant="h4">1.2s</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Conversations"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Chat Sessions List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Chat Sessions
        </Typography>
        <List>
          {filteredSessions.map((session, index) => (
            <React.Fragment key={session.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <UserIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        User Query
                      </Typography>
                      <Chip
                        icon={getQueryIcon(session.userQuery.type)}
                        label={session.userQuery.type}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {session.userQuery.content}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(session.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>

              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <AIIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="AI Response"
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {session.aiResponse.content}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < filteredSessions.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AIChat; 