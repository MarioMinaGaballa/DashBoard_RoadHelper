import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { subDays, format } from 'date-fns';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mockServiceData = [
  { name: 'Fuel', value: 35 },
  { name: 'Police', value: 25 },
  { name: 'Maintenance', value: 20 },
  { name: 'Towing', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const mockActiveRequests = [
  { id: 1, lat: 51.505, lng: -0.09, type: 'SOS', description: 'Flat tire' },
  { id: 2, lat: 51.51, lng: -0.1, type: 'Help', description: 'Out of fuel' },
  { id: 3, lat: 51.515, lng: -0.095, type: 'SOS', description: 'Accident' },
];

const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline'>('offline');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userRegistrations, setUserRegistrations] = useState<{ date: string, users: number }[]>([]);

  useEffect(() => {
    fetch('http://81.10.91.96:8132/api')
      .then(res => res.json())
      .then(data => {
        setTotalUsers(data.data.users.length);
        // فلترة مستخدمي Google فقط
        const googleUsers = data.data.users.filter(user => user.user_type === 'google');
        // تجهيز مصفوفة آخر 30 يوم
        const days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), 29 - i);
          return { date: format(date, 'yyyy-MM-dd'), users: 0 };
        });
        // عد المستخدمين لكل يوم
        googleUsers.forEach(user => {
          const created = user.created_at ? user.created_at.slice(0, 10) : null;
          if (created) {
            const day = days.find(d => d.date === created);
            if (day) day.users += 1;
          }
        });
        setUserRegistrations(days);
        setLoading(false);
        setServerStatus('online');
      })
      .catch(() => {
        setLoading(false);
        setServerStatus('offline');
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active SOS Requests
              </Typography>
              <Typography variant="h4">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Help Requests
              </Typography>
              <Typography variant="h4">45</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                API Server Status
              </Typography>
              <Typography
                variant="h4"
                color={serverStatus === 'online' ? 'success.main' : 'error.main'}
              >
                {serverStatus.toUpperCase()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Map */}
      <Grid container spacing={3}>
        {/* User Registrations Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Registrations (Last 30 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Service Usage Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Service Usage Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockServiceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockServiceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Live Activity Map */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Live Activity Map
            </Typography>
            <Box sx={{ height: 400 }}>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mockActiveRequests.map((request) => (
                  <Marker
                    key={request.id}
                    position={[request.lat, request.lng]}
                  >
                    <Popup>
                      <Typography variant="subtitle2">
                        {request.type} Request
                      </Typography>
                      <Typography variant="body2">
                        {request.description}
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 