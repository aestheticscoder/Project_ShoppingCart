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

# User Controller

This repository contains the user controller for the "Shopping Cart" project. The user controller is responsible for managing user-related functionality, such as user creation, user authentication, retrieving user details, and updating user information.

## Functionality

### 1. createUser

This function handles the creation of a new user. It validates the input data, checks for existing users with the same phone number or email, hashes the password, and stores the user details in the database.

### 2. loginUser

This function handles user login. It verifies the provided email and password, generates a JSON Web Token (JWT) for authentication, and returns the token along with the user's ID.

### 3. getUserById

This function retrieves user details based on the provided user ID. It validates the user ID, searches for the user in the database, and returns the user's profile information.

### 4. updateUser

This function updates the user's information based on the provided user ID and data. It performs validations, such as checking for duplicate email or phone numbers, and updates the user's details in the database. It also supports updating the user's profile image by uploading a file.



### Product

# Product Controller

This repository contains the product controller for the "Shopping Cart" project. The product controller is responsible for managing product-related functionality, such as creating products, retrieving product details, updating products, and deleting products.

## Functionality

### 1. createProduct

This function handles the creation of a new product. It validates the input data, checks for existing products with the same title, uploads the product image, and stores the product details in the database.

### 2. getProduct

This function retrieves a list of products based on the provided filters, such as size, price sort, name, price greater than, and price less than. It applies the filters and sorting options to the product data and returns the matching products.

### 3. getProductById

This function retrieves the details of a specific product based on the provided product ID. It checks if the product exists and is not deleted and returns the product data.

### 4. updateProduct

This function updates the details of a product based on the provided product ID and data. It validates the product ID, checks for duplicate titles, uploads a new product image if provided, and updates the product details in the database.

### 5. deletedProduct

This function marks a product as deleted based on the provided product ID. It validates the product ID, checks if the product exists and is not already deleted, and sets the isDeleted flag to true and the deletedAt timestamp to the current date.





### Cart

# Cart Controller

This repository contains the cart controller for the "Shopping Cart" project. The cart controller is responsible for managing cart-related functionality, such as creating a cart, updating the cart, retrieving cart details, and deleting the cart.

## Functionality

### 1. createCart

This function handles the creation of a new cart for a user. It validates the input data, checks if the user and product exist, and updates the cart items and total price accordingly.

### 2. updateCart

This function updates the cart for a user. It validates the input data, checks if the user and product exist, and either removes or reduces the quantity of a product in the cart based on the provided data.

### 3. getCart

This function retrieves the details of a cart for a user. It validates the user ID, checks if the user exists, and returns the cart data associated with the user.

### 4. deleteCart

This function deletes the cart for a user. It validates the user ID, checks if the user exists, and clears the cart items and total price.





### Order

# Order Controller

This repository contains the order controller for the "Order Management" project. The order controller is responsible for managing order-related functionality, such as creating an order and updating the order status.

## Functionality

### 1. createOrder

This function handles the creation of a new order for a user. It validates the input data, checks if the user and cart exist, and creates an order with the provided details.

### 2. updateOrder

This function updates the status of an existing order. It validates the input data, checks if the user and order exist, and updates the order status to the provided value.






## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

.

## Contact

For any questions or inquiries, please contact believe0256@gmail.com.

