const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    // existing registration code
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Existing author and title routes...

// Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book && book.review) {
        res.json({ review: book.review });
    } else {
        res.status(404).json({message: "Review not found"});
    }
});

module.exports.general = public_users;
