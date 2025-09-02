# Dynecron_Pueba Frontend

This is a React application built with Vite and TypeScript.

## Prerequisites

- Node.js (v20 or higher)
- Yarn or npm
- Docker (optional, for containerized development)

## Development Setup

1. **Create Docker Network** (if not already created):
   ```bash
   docker network create dynecron_network
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the required environment variables.

4. **Run Development Server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Docker Setup

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```
   The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_API_URL=http://localhost:8000  # Backend API URL
# Add other environment variables as needed
```

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint
- `format` - Format code with Prettier

## Project Structure

```
src/
  components/    # Reusable components
  pages/         # Page components
  services/      # API services
  styles/        # Global styles
  utils/         # Utility functions
  App.tsx        # Main application component
  main.tsx       # Application entry point
  vite-env.d.ts  # TypeScript type declarations
```

## Linting and Formatting

- ESLint for code linting
- Prettier for code formatting

Run the following commands:

```bash
yarn lint     # Check for linting errors
yarn format   # Format code
```

## Production Build

To create a production build:

```bash
yarn build
```

The build artifacts will be stored in the `dist/` directory.
