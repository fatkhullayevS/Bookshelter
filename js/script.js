"use strict";

const elLogoutBtn = document.querySelector(".logout-btn")
const elRenderBook = document.querySelector(".render-book")
const elSearchResult = document.querySelector(".search-result");
const elForm = document.querySelector(".form-home__btn")
const elPrevBtn = document.querySelector(".prev-btn")
const elNextBtn = document.querySelector(".next-btn")
const elPag = document.querySelector(".render-pag")
const elBookmarkList = document.querySelector(".bookmark")
const elBookmarkBtn = document.querySelector(".bookmark-btn")
const elInfoBtn = document.querySelector(".info-btn")
const elInput = document.querySelector(".search-input")
const elDeleteBookmarkBtn = document.querySelector(".bookmark__btn-delete")
const elNewest = document.querySelector(".hero__filter-btn")

// LOGIN
const token = window.localStorage.getItem("token");

if(!token){
    window.location.replace("index.html")
};

elLogoutBtn.addEventListener("click", function() {
    window.localStorage.removeItem("token");

    window.location.replace("index.html")
})

const localData = JSON.parse(window.localStorage.getItem("bookmark"))


const bookmarks = localData || []


let search = "animal";
let page = "1"
let orederByNewest = "&"

const renderBooks = function(arr){
    elRenderBook.innerHTML = null
    for(let book of arr.items){
        const html = `
        <div class="col-4">
        <div class="render-book__card">
        <img class="render-book__img" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="" width="201"
        height="202">
        <h1 class="render-book__title">${book.volumeInfo.title}</h1>
        <p class="render-book__desc">${book.volumeInfo.authors}</p>
        <p class="render-book__data">${book.volumeInfo.publishedDate}</p>
        <div class="render-book__btn">
        <div>
        <button data-bookmark-btn-id="${book.id}" class="render-book__bookmark bookmark-btn">Bookmark</button>
        <button class="render-book__info info-btn " data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight" data-more-info-id="${book.id}" aria-controls="offcanvasRight">More
        info</button>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">${book.volumeInfo.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
        aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
        <img class="canvas-img" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt=""
        width="222" height="299">
        <p class="canvas-desc">${book.volumeInfo.description}</p>
        <p class="canvas__author">Author: <span
        class="canvas__author-res">${book.volumeInfo.authors}</span></p>
        <p class="canvas__author">Published : <span
        class="canvas__author-res">${book.volumeInfo.publishedDate}</span></p>
        <p class="canvas__author">Publishers: <span
        class="canvas__author-res">${book.volumeInfo.publisher}</span></p>
        <p class="canvas__author">Categories: <span
        class="canvas__author-res">${book.volumeInfo.categories}</span></p>
        <p class="canvas__author">Pages Count: <span
        class="canvas__author-res">${book.volumeInfo.pageCount}</span></p>
        </div>
        </div>

        </div>
        <a href="${book.volumeInfo?.previewLink}" class="render-book__read">Read</a>
        </div>
        </div>
        </div>
        `
        elRenderBook.insertAdjacentHTML("beforeend", html)
    }
}

const renderBookmark = function(data){
    elBookmarkList.innerHTML = null;
    for(let bookmark of data){
        const bookmarkHtml = `
        <div class="bookmark__list">
    <div class="bookmark__left">
    <h1 class="bookmark__heading">${bookmark.volumeInfo.title}</h1>
    <p class="bookmark__desc">${bookmark.volumeInfo.authors}</p>
    </div>
    <div class="bookmark__img">
    <a href="${bookmark.volumeInfo.previewLink}" class="bookmark__btn-read"><img src="./images/book.svg" alt="" width="24"
    height="24"></a>
    <button class="bookmark__btn-delete"><img class="bookmark__btn-delete" data-bookmark-delete-id="${bookmark.id}" src="./images/delete.svg" alt="" width="24"
    height="24"></button>
    </div>
    </div>
    `

    elBookmarkList.insertAdjacentHTML("beforeend", bookmarkHtml);
    }

}

elBookmarkList.addEventListener("click", function(e){
    if(e.target.matches(".bookmark__btn-delete")){
        const bookmarkDeleteId = e.target.dataset.bookmarkDeleteBtnId;
        const foundBookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id === bookmarkDeleteId)

       bookmarks.splice(foundBookmarkIndex, 1);
       elBookmarkList.innerHTML = null

        window.localStorage.setItem('bookmark', JSON.stringify(bookmarks))

        if(bookmarks.length === 0){
            window.localStorage.removeItem("bookmark")
        }
       renderBookmark(bookmarks, elBookmarkList)
    }
})

const getBooks = async function(){
    let startIndex = (page - 1) * 10 + 1;
        const request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=search+${search}&startIndex=${startIndex}${orederByNewest}`);

        const books = await request.json();
        const data2 = books.items

        elSearchResult.textContent = `${books.totalItems}`

        renderBooks(books, elRenderBook)
        renderBtns(books)


    elRenderBook.addEventListener("click", function(evt){
        if(evt.target.matches(".bookmark-btn")){
            const bookmarkId = evt.target.dataset.bookmarkBtnId;
            const foundBookmark = data2.find(book => book.id === bookmarkId)

            if(!bookmarks.includes(foundBookmark)){
                bookmarks.push(foundBookmark)
            }
            elBookmarkList.innerHTML = null

            renderBookmark(bookmarks, elBookmarkList)
            window.localStorage.setItem('bookmark', JSON.stringify(bookmarks))
        }
    })
}


elInput.addEventListener("input", function(e){
    search = elInput.value;

    getBooks()
})

elNewest.addEventListener("click", function () {
    orederByNewest = "&";
    orederByNewest += "orderBy=newest";
    getBooks();
  });


elPrevBtn.addEventListener("click", function(){
    page--

    getBooks()
});

elNextBtn.addEventListener("click", function(){
    page++

    getBooks()
})

const renderBtns = function (movies){
    elPag.innerHTML = null
    for(let i = 1; i <= Math.ceil(movies.totalItems/10); i++){
        var btn = document.createElement("button")
        btn.setAttribute("class", "btn mx-auto pag-btn btn-primary mt-3 ms-2")
        elPag.style.marginLeft = "auto"
        elPag.style.marginRight = "auto"
        btn.textContent = i
        elPag.appendChild(btn)
    }
}

elPag.addEventListener("click", function(evt){
    elPag.innerHTML = null
    page = evt.target.textContent;
    getBooks()
})

renderBookmark(bookmarks, elBookmarkList)
getBooks(search, page)