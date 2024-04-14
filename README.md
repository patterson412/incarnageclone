# Incarnage Clone - Athletic Wear Website

## Stack used

This project is a clone of the Incarnage website, an athletic wear e-commerce platform. It is built using the following technologies:

- Backend: Node.js, Express.js, Passport.js, Redis
- Frontend: Vite + React, Tailwind CSS
- Database: PostgreSQL

## Setup and Usage

- Clone repo and setup environment var's for database, express session secret, redis

```
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=
SESSION_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

- DB setup

The website expects a users table in the PostgreSQL database with the following columns:

username (varchar255)
password (varchar255)
role(varchar255)
products (text[])

The products column is used to store the IDs of the products ordered by the user.

always when a user is registered, it is registered as a role of 'user'. 
But we can add admin roles, and implement more exclusive access to areas of the webapp for administrative needs. (TODO)

- Start the application
    - `cd` into the Backend folder.
    - Run `npm install` to install the dependencies.
    - Run `npm run dev` to start the server.
    - Visit `http://localhost:3000` in your browser to view the website.


## TODO

The following features are planned for future implementation:

- Make authentication a choice, instead of mandatory
- Implement sign-in with Google
- Use the checkRole function in the server file to implement administrative access
- Implement the functionality of the "Shop Now" button on the home page
- Implement the "You may also like" section on the product pages
- Implement detailed product descriptions and information
- Implement the checkout process using a payment gateway (e.g., Payhere sandbox)
- Update the products column in the users table with the ordered product IDs
- Add more unique product images and information, instead of replicating the existing ones
