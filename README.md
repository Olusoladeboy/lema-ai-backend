# Users-Posts Backend

This is the backend server for the Web Developer Assignment, built with Node.js, TypeScript, Express.js, and SQLite3.

## Prerequisites

- Node
- TypeScript
- Npm
- SQLite3

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```
   This will compile TypeScript files from `src/` into JavaScript in the `dist/` directory.

## Running the Server

Start the server in production mode:

```bash
npm start
```

For development mode with hot reloading:

```bash
npm run dev
```

For development mode without hot reloading (required by nodemon):

```bash
npm run dev:once
```

## Project Structure

```
backend/
├── src/           # TypeScript source files
├── dist/          # Compiled JavaScript files (generated after build)
├── config/        # Configuration files
└── ...
```

## Important Notes

- Make sure the TypeScript files are properly compiled into the `dist/` directory before running the server
- The production server runs from the compiled files in `dist/`
- Development mode runs directly with ts-node and nodemon for hot reloading
