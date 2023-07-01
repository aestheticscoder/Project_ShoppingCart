# Project_ShoppingCart


# Products Management

Products Management is a project that aims to provide a comprehensive solution for managing various features related to user accounts, products, carts, and orders. The project is divided into four features: User, Product, Cart, and Order. Each feature is built by following a set of steps, including creating models, building APIs, testing, deployment, and integration with the frontend.

## Getting Started

To get started with the Products Management project, follow the instructions below.

### Prerequisites

- Node.js (version X.X.X)
- MongoDB (version X.X.X)
- AWS S3 bucket (for storing user profile images)

### Installation

1. Clone the repository:


   git clone <repository-url>


2. Install the dependencies:


   cd products-management
   npm install


3. Configure the environment variables:
   
   Rename the `.env.example` file to `.env` and update the values with your specific configuration.

4. Start the application:


   npm start


5. The application should now be running on specifeid Port.

## Features

### User

The User feature allows users to register, login, view their profile, and update their profile information. It includes the following APIs:

- **POST /register**: Create a new user account with the provided details, including a profile image. The image is uploaded to an AWS S3 bucket, and the user document is stored in the database.

- **POST /login**: Allow users to log in with their email and password. On a successful login attempt, a JWT token containing the user ID is returned.

- **GET /user/:userId/profile** (Authentication required): Fetch the details of the user's profile.

- **PUT /user/:userId/profile** (Authentication and Authorization required): Update the user's profile information.

### Product

...

### Cart

...

### Order

...

## Contributing

...

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

...

## Contact

For any questions or inquiries, please contact believe0256@gmail.com.

