const localStorageKey = "BOOKS_DATA";

function checkStorage() {
  return typeof Storage !== "undefined";
}

function insertData(data) {
  if (checkStorage()) {
    let booksData = [];

    if (localStorage.getItem(localStorageKey) === null) {
      booksData = [];
    } else {
      booksData = JSON.parse(localStorage.getItem(localStorageKey));
    }

    booksData.unshift(data);
    localStorage.setItem(localStorageKey, JSON.stringify(booksData));
  }
}

function getData() {
  if (checkStorage()) {
    return JSON.parse(localStorage.getItem(localStorageKey)) || [];
  } else {
    return [];
  }
}

function makeBook(id, judul, penulis, tahun) {
  const title = document.createElement("h3");
  title.innerText = judul;

  const writer = document.createElement("p");
  writer.innerText = penulis;

  const year = document.createElement("p");
  year.innerText = tahun;

  const moveBtn = document.createElement("button");
  moveBtn.classList.add("moveBtn");
  moveBtn.setAttribute("onclick", `moveBook(${id})`);
  moveBtn.innerText = "Move";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("removeBtn");
  removeBtn.setAttribute("onclick", `deleteBook(${id})`);
  removeBtn.innerText = "Remove";

  const aksi = document.createElement("div");
  aksi.append(moveBtn, removeBtn);

  const Book = document.createElement("article");
  Book.append(title, writer, year, aksi);

  return Book;
}

function showBook() {
  const unCompleted = document.querySelector("#unCompleted");
  const completed = document.querySelector("#completed");

  const book_data = getData();

  unCompleted.innerHTML = "";
  completed.innerHTML = "";

  for (let book of book_data) {
    let Template_Book = makeBook(book.id, book.title, book.writer, book.year);

    if (book.isCompleted === true) {
      completed.appendChild(Template_Book);
    } else {
      unCompleted.appendChild(Template_Book);
    }
  }
}

function moveBook(id) {
  const books_Data = getData();

  for (let book of books_Data) {
    if (book.id == id) {
      if (book.isCompleted == true) {
        book.isCompleted = false;
      } else {
        book.isCompleted = true;
      }
    }
  }

  localStorage.setItem(localStorageKey, JSON.stringify(books_Data));
  showBook();
}

function deleteBook(id) {
  let konfirmasi = confirm("Anda yakin akan menghapus data buku ini ?");

  if (konfirmasi == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));
    showBook();
    alert(`Buku ${bookDataDetail[0].title} telah terhapus dari rak`);
  } else {
    return 0;
  }
}

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const titleInput = document.getElementById("title").value;
  const writerInput = document.getElementById("writer").value;
  const yearInput = document.getElementById("year").value;
  let isCompleted = document.getElementById("isCompleted").checked;

  let newDataBook = {
    id: +new Date(),
    title: titleInput,
    writer: writerInput,
    year: yearInput,
    isCompleted: isCompleted,
  };

  insertData(newDataBook);
  showBook();
});

window.addEventListener("DOMContentLoaded", function () {
  if (checkStorage()) {
    showBook();
  } else {
    alert("perangkat anda tidak support local Storage");
  }
});
