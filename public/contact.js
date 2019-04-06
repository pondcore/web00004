// 1. Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// 2. UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    // 3. predefined books
   
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  // 4. add book
  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"> Delete </a></td>
      `;
    list.appendChild(row);
  }

  // 11. delete book  
  static deleteBook(el) {
    // if element contains .delete class
    if (el.classList.contains('delete')) {
      // remove <a> -> <td> -> <tr>       
      el.parentElement.parentElement.remove();
    }
  }

  // 13. show alert  
  // <div class="alert alert-success/alert-danger>Message</div>
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  // 9. clear fields  
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// 4. Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// 5. Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // 7. Prevent actual submit action
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // 12. Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // 6. Instatiate book
    const book = new Book(title, author, isbn);
    // console.log(book);

    // 8. Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // 13. Show success message
    UI.showAlert('Form Added', 'success');

    // 9. Clear fields
    UI.clearFields();
  }
});

// 10. Event: Remove a Book - event propagation by selecting the parent
document.querySelector('#book-list').addEventListener('click', (e) => {
  // console.log(e.target);

  // 11. Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // 13. Show success message
  UI.showAlert('Book Removed', 'success');
});
