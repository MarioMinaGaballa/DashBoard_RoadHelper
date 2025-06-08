import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data - TODO: Replace with API data
const mockRequestData = [
  {
    id: 1,
    type: 'SOS',
    user: 'John Doe',
    location: { lat: 51.505, lng: -0.09 },
    timestamp: '2024-02-15T10:30:00',
    status: 'Closed',
  },
  {
    id: 2,
    type: 'Help',
    user: 'Jane Smith',
    location: { lat: 51.51, lng: -0.1 },
    timestamp: '2024-02-15T11:45:00',
    status: 'Open',
  },
  // Add more mock data as needed
];

const mockRatingData = [
  { rating: 1, count: 5 },
  { rating: 2, count: 8 },
  { rating: 3, count: 15 },
  { rating: 4, count: 25 },
  { rating: 5, count: 47 },
];

const mockServiceUsageData = [
  { service: 'Fuel', count: 150 },
  { service: 'Police', count: 80 },
  { service: 'Maintenance', count: 120 },
  { service: 'Towing', count: 60 },
  { service: 'Other', count: 30 },
];

const mockRequestTrendData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  requests: Math.floor(Math.random() * 50) + 10,
}));

const Analytics: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'warning';
      case 'Closed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SOS':
        return 'error';
      case 'Help':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Service Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Response Time
              </Typography>
              <Typography variant="h4">4.5 min</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                User Satisfaction
              </Typography>
              <Typography variant="h4">4.2/5</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Requests
              </Typography>
              <Typography variant="h4">23</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Request Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Request Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRequestTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#8884d8"
                  name="Daily Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Service Usage Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Service Usage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockServiceUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Number of Requests" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* User Ratings Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Ratings Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRatingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Number of Ratings" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Request Hotspots Map */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Request Hotspots
            </Typography>
            <Box sx={{ height: 300 }}>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* TODO: Implement heatmap layer with actual data */}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Requests Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Requests
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockRequestData.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.type}
                          color={getTypeColor(request.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{request.user}</TableCell>
                      <TableCell>
                        {request.location.lat.toFixed(4)},{' '}
                        {request.location.lng.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        {new Date(request.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 