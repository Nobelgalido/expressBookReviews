const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate async operation with Promise
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100);
  });
};

// Helper function to simulate async operation for getting book by ISBN
const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 100);
  });
};

// Helper function to simulate async operation for getting books by author
const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = {};
      for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor[isbn] = books[isbn];
        }
      }
      if (Object.keys(booksByAuthor).length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 100);
  });
};

// Helper function to simulate async operation for getting books by title
const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = {};
      for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
          booksByTitle[isbn] = books[isbn];
        }
      }
      if (Object.keys(booksByTitle).length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 100);
  });
};

// Task 6: Register new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};
  
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};
  
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get all books using Promise/Async-Await
public_users.get('/async', async function (req, res) {
  try {
    const booksData = await getBooksAsync();
    return res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book by ISBN using Promise/Async-Await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBNAsync(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 12: Get books by author using Promise/Async-Await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthorAsync(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 13: Get books by title using Promise/Async-Await
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitleAsync(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
