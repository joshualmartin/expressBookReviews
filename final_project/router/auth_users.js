const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const jwtSecret = 'your_jwt_secret'; // This should be stored securely and not hardcoded

// Function to check if the username is valid
const isValid = (username) => {
    // Example validation: check if username exists in the users array
    return users.some(user => user.username === username);
};

// Function to check if username and password match the one we have in records
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username; // Assuming username is stored in JWT payload

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const userReview = book.reviews.find(r => r.username === username);
    if (userReview) {
        userReview.review = review;
    } else {
        book.reviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
