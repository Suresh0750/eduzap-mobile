# EduZap Mobile

A modern React Native mobile application built with Expo for managing educational requests. This app allows users to submit requests with images and provides a comprehensive interface for viewing, searching, and managing requests.

## Features

### Core Functionality
- **Request Management**: Create, view, and delete educational requests
- **Image Upload**: Upload images with each request using the device camera or photo library
- **Search & Filter**: Search requests by name, title, or phone number with real-time filtering
- **Pagination**: Efficient pagination controls for browsing through multiple requests
- **Form Validation**: Comprehensive client-side validation with error handling

### Technical Highlights

#### TanStack Query (React Query) for Data Caching
This application uses **TanStack Query** to efficiently manage and cache server data. Key benefits include:

- **Automatic Caching**: Request data is automatically cached to reduce unnecessary API calls
- **Background Updates**: Data stays fresh with automatic background refetching
- **Optimistic Updates**: Instant UI updates while server operations complete
- **Cache Invalidation**: Smart cache invalidation ensures data consistency after create/delete operations
- **Loading States**: Built-in loading and error states for better user experience

The caching strategy uses `staleTime: Infinity` to store request data until explicitly invalidated, ensuring optimal performance and reduced network usage.

#### Reusable Components
The application follows a component-based architecture with a library of reusable UI components:

- **Button**: Flexible button component with multiple variants (default, outline, destructive, ghost) and sizes
- **Card**: Consistent card container for grouping related content
- **Input**: Form input field with label, error handling, and validation support
- **UserAlert**: Alert component for displaying confirmations, errors, and warnings
- **ImagePreview**: Reusable image preview and upload component
- **PaginationControls**: Reusable pagination component for navigating through pages
- **RequestFilters**: Search and sort controls for filtering requests
- **RequestList**: Display component for rendering lists of requests
- **RequestForm**: Complete form component for creating new requests

All components are designed to be reusable across different parts of the application, following React best practices with proper TypeScript typing and memoization for performance optimization.

#### Image Upload
The app includes a comprehensive image upload feature:

- **Photo Library Access**: Users can select images from their device photo library
- **Permission Handling**: Automatic permission requests with user-friendly error messages
- **Image Preview**: Preview selected images before submission
- **Image Editing**: Basic image editing with aspect ratio constraints
- **Multipart Upload**: Images are uploaded as part of multipart/form-data requests
- **Image Removal**: Easy removal of selected images before submission

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: TanStack Query for server state
- **Navigation**: Expo Router
- **HTTP Client**: Axios
- **Image Handling**: Expo Image Picker
- **UI Components**: Custom component library
- **Form Validation**: Zod schema validation

## Project Structure

```
eduzap-mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Main screen
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── UserAlert.tsx
│   ├── ImagePreview.tsx
│   ├── PaginationControls.tsx
│   ├── RequestFilters.tsx
│   ├── RequestForm.tsx
│   └── RequestList.tsx
├── lib/                   # Core utilities
│   ├── api.ts            # TanStack Query hooks
│   ├── apiClient.ts      # Axios client configuration
│   ├── hooks.ts          # Custom React hooks
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── validate.ts       # Zod validation schemas
└── assets/               # Images and static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (optional, can use npx)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd eduzap-mobile
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your preferred platform
```bash
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For Web
```

## Usage

### Creating a Request

1. Fill in the required fields:
   - Name
   - Phone Number (10 digits)
   - Request Title

2. Optionally upload an image by tapping the image upload area

3. Tap "Submit Request" to create the request

### Managing Requests

- Use the search bar to filter requests by name, title, or phone number
- Sort requests in ascending or descending order
- Use pagination controls to navigate through multiple pages
- Pull down to refresh the request list
- Tap delete on any request to remove it

## API Configuration

The app requires a backend API endpoint. Configure the API base URL in the `lib/apiClient.ts` file.

## Development

### Code Style

The project uses ESLint for code quality. Run the linter with:

```bash
npm run lint
```

### TypeScript

The project is fully typed with TypeScript. Type definitions can be found in the `lib/types.ts` file.

## Performance Optimizations

- **React.memo**: Components are memoized to prevent unnecessary re-renders
- **useCallback**: Event handlers are memoized to maintain referential equality
- **useMemo**: Computed values are memoized for performance
- **TanStack Query Caching**: Reduces API calls through intelligent caching
- **Image Optimization**: Images are compressed before upload

## License

Private project - All rights reserved

