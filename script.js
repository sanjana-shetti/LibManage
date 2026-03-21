// ---------- SIGNUP ----------
document.getElementById('signupForm')?.addEventListener('submit', function(e){
    e.preventDefault();

    let email = document.getElementById('signupEmail').value;
    let password = document.getElementById('signupPassword').value;

    if(!email.endsWith('@gmail.com')){
        signupError.textContent = "Use Gmail only";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({email, password});

    localStorage.setItem('users', JSON.stringify(users));
    alert("Account created!");
    window.location.href="index.html";
});

// ---------- LOGIN ----------
document.getElementById('loginForm')?.addEventListener('submit', function(e){
    e.preventDefault();

    let roleValue = document.getElementById('role').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if(roleValue === 'admin'){
        if(email === 'admin@gmail.com' && password === 'admin123'){
            window.location.href="admin_dashboard.html";
        } else {
            error.textContent="Invalid admin";
        }
    } else {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let user = users.find(u=>u.email===email && u.password===password);

        if(user){
            window.location.href="dashboard.html";
        } else {
            error.textContent="Invalid login";
        }
    }
});

// ---------- ADMIN ADD BOOK ----------
document.getElementById('addBookForm')?.addEventListener('submit', function(e){
    e.preventDefault();

    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let quantity = parseInt(document.getElementById('quantity').value);

    let books = JSON.parse(localStorage.getItem('books') || '[]');

    books.push({name, author, quantity});
    localStorage.setItem('books', JSON.stringify(books));

    alert("Book added!");
    this.reset();
    displayBooks();
});

// ---------- DISPLAY ADMIN ----------
function displayBooks(){
    let books = JSON.parse(localStorage.getItem('books') || '[]');
    let tbody = document.querySelector('#bookTable tbody');
    if(!tbody) return;

    tbody.innerHTML="";
    books.forEach((b,i)=>{
        tbody.innerHTML+=`
        <tr>
            <td>${b.name}</td>
            <td>${b.author}</td>
            <td>${b.quantity}</td>
            <td>
                <button onclick="deleteBook(${i})">Delete</button>
            </td>
        </tr>`;
    });
}
displayBooks();

// ---------- DELETE ----------
function deleteBook(i){
    let books = JSON.parse(localStorage.getItem('books'));
    books.splice(i,1);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
}

// ---------- MEMBER DISPLAY ----------
function displayMemberBooks(){
    let books = JSON.parse(localStorage.getItem('books') || '[]');
    let tbody = document.querySelector('#memberBookTable tbody');
    if(!tbody) return;

    tbody.innerHTML="";
    books.forEach((b,i)=>{
        tbody.innerHTML+=`
        <tr>
            <td>${b.name}</td>
            <td>${b.author}</td>
            <td>${b.quantity}</td>
            <td>
                <button onclick="issueBook(${i})">Issue</button>
            </td>
        </tr>`;
    });
}
displayMemberBooks();

// ---------- ISSUE WITH CUSTOM DATE ----------
function issueBook(index){
    let books = JSON.parse(localStorage.getItem('books') || '[]');
    let records = JSON.parse(localStorage.getItem('records') || '[]');

    let dueInput = document.getElementById('dueDateInput').value;

    if(!dueInput){
        alert("Select due date!");
        return;
    }

    let today = new Date().toISOString().split('T')[0];
    if(dueInput < today){
        alert("Invalid date!");
        return;
    }

    if(books[index].quantity > 0){

        books[index].quantity--;

        let issueDate = new Date();

        records.push({
            name: books[index].name,
            issueDate: issueDate.toLocaleDateString(),
            dueDate: new Date(dueInput).toLocaleDateString()
        });

        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('records', JSON.stringify(records));

        alert("Book issued!");

        displayMemberBooks();
        displayRecords();

    } else {
        alert("Not available!");
    }
}

// ---------- RECORDS ----------
function displayRecords(){
    let records = JSON.parse(localStorage.getItem('records') || '[]');
    let tbody = document.querySelector('#recordTable tbody');
    if(!tbody) return;

    tbody.innerHTML="";
    records.forEach(r=>{
        tbody.innerHTML+=`
        <tr>
            <td>${r.name}</td>
            <td>${r.issueDate}</td>
            <td>${r.dueDate}</td>
        </tr>`;
    });
}
displayRecords();

// ---------- SEARCH ----------
function searchBooks(){
    let val = document.getElementById('searchInput').value.toLowerCase();
    let books = JSON.parse(localStorage.getItem('books') || '[]');

    let filtered = books.filter(b=>b.name.toLowerCase().includes(val));

    let tbody = document.querySelector('#memberBookTable tbody');
    tbody.innerHTML="";
    filtered.forEach((b,i)=>{
        tbody.innerHTML+=`
        <tr>
            <td>${b.name}</td>
            <td>${b.author}</td>
            <td>${b.quantity}</td>
            <td><button onclick="issueBook(${i})">Issue</button></td>
        </tr>`;
    });
}