import axios from 'axios';

const API_URL = 'http://81.10.91.96:8132/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/');
    // Transform the API response to match our frontend structure
    return response.data.data.users.map((user: any) => ({
      id: user.id || user.User_id,
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone,
      vehicleDetails: `${user.car_model || ''} - ${user.car_color || ''} - ${user.plate_number || ''} ${user.letters || ''}`.trim(),
      registrationMethod: user.user_type || 'Email',
      licenseStatus: user.license_status || user.status || user.licenseStatus || user.state || 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
    }));
  } catch (error) {
    throw error;
  }
};

export const updateUserLicense = async (email: string, status: 'approved' | 'rejected') => {
  try {
    const response = await api.post('/update-license-status', { email, status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await api.get('/');
    const users = response.data.data.users;
    const clean = (str: any) => (str ? str.toString().replace(/\s+/g, '').toLowerCase() : '');
    const cleanQuery = clean(query);
    // Filter users based on the search query
    return users
      .filter((user: any) => 
        clean(user.first_name).includes(cleanQuery) ||
        clean(user.last_name).includes(cleanQuery) ||
        clean(user.email).includes(cleanQuery) ||
        clean(user.phone).includes(cleanQuery) ||
        clean(user.car_model).includes(cleanQuery) ||
        clean(user.car_color).includes(cleanQuery) ||
        clean(user.plate_number).includes(cleanQuery) ||
        clean(user.letters).includes(cleanQuery)
      )
      .map((user: any) => ({
        id: user.id || user.User_id,
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        vehicleDetails: `${user.car_model || ''} - ${user.car_color || ''} - ${user.plate_number || ''} ${user.letters || ''}`.trim(),
        registrationMethod: user.user_type || 'Email',
        licenseStatus: user.license_status || user.status || user.licenseStatus || user.state || 'Pending',
        registrationDate: new Date().toISOString().split('T')[0],
      }));
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getLicenseImage = async (email: string) => {
  try {
    const cleanEmail = email.trim();
    console.log('Requesting license for email:', cleanEmail);
    const response = await fetch('http://81.10.91.96:8132/api/get-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch license image');
    }

    const data = await response.json();
    console.log('license api response', data);

    return {
      front: data.front_image_url || data.imageUrl || data.url || null,
      back: data.back_image_url || null,
    };
  } catch (error) {
    return { front: null, back: null };
  }
};

export default api; 