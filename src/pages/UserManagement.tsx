import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getUsers, updateUserLicense, searchUsers, getLicenseImage } from '../services/api';
import { subDays, format } from 'date-fns';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  registrationMethod: string;
  vehicleDetails: string;
  licenseStatus: 'Pending' | 'Verified' | 'Rejected';
  registrationDate: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [licenseImages, setLicenseImages] = useState<{ front: string | null, back: string | null }>({ front: null, back: null });

  useEffect(() => {
    const fetchAllUsersWithLicenseStatus = async () => {
      setLoading(true);
      try {
        const users = await getUsers();
        // جلب حالة الترخيص لكل مستخدم
        const usersWithStatus = await Promise.all(
          users.map(async (user: any) => {
            try {
              const res = await fetch('http://81.10.91.96:8132/api/get-license', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
              });
              const licenseData = await res.json();
              return { ...user, licenseStatus: licenseData.status || 'Pending' };
            } catch {
              return { ...user, licenseStatus: 'Pending' };
            }
          })
        );
        setUsers(usersWithStatus);
      } catch (err: any) {
        setError(err.response?.data?.message || 'حدث خطأ في جلب بيانات المستخدمين');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsersWithLicenseStatus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      const fetchAllUsersWithLicenseStatus = async () => {
        setLoading(true);
        try {
          const users = await getUsers();
          const usersWithStatus = await Promise.all(
            users.map(async (user: any) => {
              try {
                const res = await fetch('http://81.10.91.96:8132/api/get-license', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: user.email }),
                });
                const licenseData = await res.json();
                return { ...user, licenseStatus: licenseData.status || 'Pending' };
              } catch {
                return { ...user, licenseStatus: 'Pending' };
              }
            })
          );
          setUsers(usersWithStatus);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error fetching users');
        } finally {
          setLoading(false);
        }
      };
      fetchAllUsersWithLicenseStatus();
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log('users after update', users);
  }, [users]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // إذا كان البحث فارغًا، أعد تحميل كل المستخدمين مع حالة الترخيص
      const fetchAllUsersWithLicenseStatus = async () => {
        setLoading(true);
        try {
          const users = await getUsers();
          const usersWithStatus = await Promise.all(
            users.map(async (user: any) => {
              try {
                const res = await fetch('http://81.10.91.96:8132/api/get-license', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: user.email }),
                });
                const licenseData = await res.json();
                return { ...user, licenseStatus: licenseData.status || 'Pending' };
              } catch {
                return { ...user, licenseStatus: 'Pending' };
              }
            })
          );
          setUsers(usersWithStatus);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error fetching users');
        } finally {
          setLoading(false);
        }
      };
      fetchAllUsersWithLicenseStatus();
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(searchQuery);
      // تحويل كل مستخدم لنفس شكل المستخدم في getUsers
      const normalizedUsers = data.map((user: any) => ({
        id: user.id || user.User_id,
        fullName: user.fullName || `${user.first_name || ''} ${user.last_name || ''}`,
        email: user.email,
        phone: user.phone,
        registrationMethod: user.registrationMethod || user.user_type || 'Email',
        vehicleDetails: user.vehicleDetails || `${user.car_model || ''} - ${user.car_color || ''} - ${user.plate_number || ''} ${user.letters || ''}`.trim(),
      }));
      // جلب حالة الترخيص لكل مستخدم في نتائج البحث
      const usersWithStatus = await Promise.all(
        normalizedUsers.map(async (user: any) => {
          try {
            const res = await fetch('http://81.10.91.96:8132/api/get-license', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email }),
            });
            const licenseData = await res.json();
            return { ...user, licenseStatus: licenseData.status || 'Pending' };
          } catch {
            return { ...user, licenseStatus: 'Pending' };
          }
        })
      );
      setUsers(usersWithStatus);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLicense = async (user: User) => {
    setSelectedUser(user);
    setLicenseDialogOpen(true);
    setLicenseImages({ front: null, back: null });
    try {
      const images = await getLicenseImage(user.email);
      setLicenseImages(images);
    } catch {
      setLicenseImages({ front: null, back: null });
    }
  };

  const handleCloseDialog = () => {
    setLicenseDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateLicenseStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await updateUserLicense(selectedUser.email, status);
      // Update the user in the local state without refresh
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === selectedUser.email
            ? { ...user, licenseStatus: status === 'approved' ? 'Verified' : 'Rejected' }
            : user
        )
      );
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating license status');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fullName', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'registrationMethod', headerName: 'Registration Method', width: 150 },
    { field: 'vehicleDetails', headerName: 'Vehicle Details', width: 200 },
    {
      field: 'licenseStatus',
      headerName: 'License Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Verified'
              ? 'success'
              : params.value === 'Pending'
              ? 'warning'
              : 'error'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleViewLicense(params.row)}
          color="primary"
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetch('http://81.10.91.96:8132/api')
      .then(res => res.json())
      .then(data => {
        // فلترة المستخدمين ليكونوا فقط من نوع google
        const googleUsers = data.data.users.filter((user: any) => user.user_type === 'google');
        // جهز مصفوفة آخر 30 يوم
        const days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), 29 - i);
          return { date: format(date, 'yyyy-MM-dd'), users: 0 };
        });

        // عد المستخدمين لكل يوم
        googleUsers.forEach((user: any) => {
          const created = user.created_at ? user.created_at.slice(0, 10) : null;
          if (created) {
            const day = days.find(d => d.date === created);
            if (day) day.users += 1;
          }
        });
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search users"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          disabled={loading}
          placeholder="Search by name, email, or phone"
        />
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pagination
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>

      <Dialog open={licenseDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>License Review</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">User Details:</Typography>
              <Typography>Name: {selectedUser.fullName}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Phone: {selectedUser.phone}</Typography>
              <Typography>Vehicle: {selectedUser.vehicleDetails}</Typography>
              <Typography>Current Status: {selectedUser.licenseStatus}</Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                {licenseImages.front || licenseImages.back ? (
                  <>
                    {licenseImages.front && (
                      <img src={licenseImages.front} alt="Front License Image" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                    )}
                    {licenseImages.back && (
                      <img src={licenseImages.back} alt="Back License Image" style={{ width: '100%', borderRadius: 8 }} />
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No license image available
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleUpdateLicenseStatus('rejected')}
            startIcon={<CancelIcon />}
            color="error"
            disabled={loading}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleUpdateLicenseStatus('approved')}
            startIcon={<CheckCircleIcon />}
            color="success"
            variant="contained"
            disabled={loading}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 