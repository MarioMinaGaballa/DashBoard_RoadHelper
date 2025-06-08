# Road Helper Admin Dashboard

A comprehensive admin dashboard for the Road Helper mobile application, built with React, TypeScript, and Material-UI.

## Features

- **Overview Dashboard**: Real-time metrics, user registrations chart, service usage breakdown, and live activity map
- **User Management**: View, search, and manage users with license verification
- **Analytics**: Detailed service usage analysis, request trends, and user ratings
- **AI Chat Monitoring**: Monitor interactions with the Gemini AI assistant
- **Notifications Center**: Send and manage push notifications to users

## Tech Stack

- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/road-helper-admin.git
   cd road-helper-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── layouts/       # Layout components
├── store/         # Redux store configuration
├── services/      # API services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

## API Integration

The dashboard is designed to work with the Road Helper API endpoints:

- Base URL: `http://81.10.91.96:8132`
- Authentication: `/api/login`
- User Management: `/api/users`
- Analytics: `/api/analytics`
- Notifications: `/api/notifications`

## Development

### Code Style

- Follow the TypeScript and React best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

### Adding New Features

1. Create new components in the appropriate directory
2. Add new routes in `App.tsx`
3. Update the sidebar navigation if needed
4. Implement API integration
5. Add proper TypeScript types

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@roadhelper.com or create an issue in the repository. 