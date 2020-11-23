// Book Class: Represents a Book
class Book {
    constructor(title, author, pages, note){
        this.title = title
        this.author = author
        this.pages = pages
        this.note = note
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks()
        books.forEach(book => UI.addBookToList(book))
    }

    static addBookToList(book){
        const list = document.querySelector("#book-list")
        
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.note}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteBook(el){
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className){
        const div = document.createElement("div")
        div.className = `alert alert-${className}`
        div.textContent = message
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")
        container.insertBefore(div, form)

        setTimeout(() => div.remove(),2000)
    }
}
// Store Class: Handle Storage
class Store{

    static getBooks(){
        let books = JSON.parse(localStorage.getItem("books"))
        return books === null ? [] : books
    }

    static addBook(book){
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static deleteBook(title){
        const books = Store.getBooks()

        books.forEach((book, index) =>{
            if(book.title === title){
                books.splice(index,1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))

    }
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks)

//Event: Add a book
const form = document.querySelector("#book-form")
form.addEventListener("submit", (e)=>{
    e.preventDefault()

    // Get form values
    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const pages = document.querySelector("#pages").value
    const note = document.querySelector("#note").value

    // Validate
    if (title === '' || author === '' || pages === '' || note === ''){
        // Error message
        UI.showAlert("Please fill in all fields", "danger")
    }else{
        // Instantiate book
        const book = new Book(title, author, pages, note)

        // Add Book to UI
        UI.addBookToList(book)

        // Add Book to localStorage
        Store.addBook(book)

        // Success Message
        UI.showAlert("Book created with success", "success")
        
        // Clear form
        form.reset()
    }
    
})

//Event: Remove a book
document.querySelector("#book-list").addEventListener("click", (e) =>{

    // Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from store
    Store.deleteBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent)

    // Success Message
    UI.showAlert("Book deleted with success", "success")
})