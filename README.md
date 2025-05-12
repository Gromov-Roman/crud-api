# CRUD API

## Architecture

The application follows a modular architecture with several key components:

1. **HTTP Server**: Built using Node.js native HTTP module
2. **In-Memory Database**: A simple Map-based solution for data storage
3. **Controllers & Routes**: Handle request routing and business logic
4. **Middleware**: For logging, error handling, and request processing
5. **Validation**: Input validation for all API operations
6. **Clustering**: Implementation of horizontal scaling with load balancing

## Features

- **Complete CRUD operations** on user resources:
   - GET /api/users - List all users
   - GET /api/users/{userId} - Get a specific user
   - POST /api/users - Create a new user
   - PUT /api/users/{userId} - Update a user
   - DELETE /api/users/{userId} - Delete a user

- **Error handling** for various scenarios:
   - Invalid UUID format
   - Non-existent resources
   - Invalid request body
   - Internal server errors

- **Logging** of requests and responses

- **Clustering** with round-robin load balancing

- **Tests** for all API endpoints

## Running the Application

Three different modes are available:

1. **Development mode**: `npm run start:dev`
   - Uses nodemon for automatic reloading

2. **Production mode**: `npm run start:prod`
   - Builds the application with webpack
   - Runs the optimized bundle

3. **Multi-instance mode**: `npm run start:multi`
   - Utilizes Node.js Cluster API
   - Starts multiple workers and a load balancer
   - Distributes requests using round-robin algorithm

## Testing

Run the tests with: `npm test`

The test suite covers various scenarios including:
- Getting all users
- Creating a new user
- Getting a specific user
- Updating a user
- Deleting a user
- Handling invalid input
- Non-existent routes and resources

## Environment Configuration

Environment variables are loaded from `.env` file, including:
- `PORT`: The port for the server (default: 4000)
- `NODE_ENV`: Environment mode (development/production)

## Key Files

- `src/server.ts`: Main entry point
- `src/app.ts`: Application setup
- `src/db/in-memory.ts`: Database implementation
- `src/controllers/user.controller.ts`: User CRUD operations
- `src/routes/user.routes.ts`: Route handler for user resources
- `src/cluster.ts`: Horizontal scaling implementation
- `test/api.test.ts`: API tests
