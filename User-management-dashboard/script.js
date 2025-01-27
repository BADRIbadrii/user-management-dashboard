const apiUrl = "https://jsonplaceholder.typicode.com/users";
let users = [];

// Select elements
const userList = document.getElementById("userList");
const addUserBtn = document.getElementById("addUserBtn");
const userFormModal = document.getElementById("userFormModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const userForm = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");

// Open modal for adding new user
addUserBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Add New User";
    userForm.reset();
    document.getElementById("userId").value = "";
    userFormModal.style.display = "block";
});

// Close modal
closeModalBtn.addEventListener("click", () => {
    userFormModal.style.display = "none";
});

// Fetch users from API and display them
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        users = await response.json();
        renderUserList();
    } catch (error) {
        alert("Error fetching users: " + error);
    }
}

// Render user list
function renderUserList() {
    userList.innerHTML = "";
    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.className = "userItem";
        userItem.innerHTML = `
            <div>
                <strong>${user.name}</strong><br>
                ${user.email} | ${user.company.name}
            </div>
            <div>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        userList.appendChild(userItem);
    });
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById("modalTitle").textContent = "Edit User";
        document.getElementById("userId").value = user.id;
        document.getElementById("firstName").value = user.name.split(" ")[0];
        document.getElementById("lastName").value = user.name.split(" ")[1];
        document.getElementById("email").value = user.email;
        document.getElementById("department").value = user.company.name;
        userFormModal.style.display = "block";
    }
}

// Delete user
async function deleteUser(userId) {
    try {
        await fetch(`${apiUrl}/${userId}`, {
            method: "DELETE"
        });
        users = users.filter(user => user.id !== userId);
        renderUserList();
    } catch (error) {
        alert("Error deleting user: " + error);
    }
}

// Handle form submission (Add/Edit)
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const user = {
        name: `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`,
        email: document.getElementById("email").value,
        company: {
            name: document.getElementById("department").value
        }
    };

    try {
        if (userId) {
            // Edit user
            await fetch(`${apiUrl}/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            });
        } else {
            // Add new user
            await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            });
        }
        fetchUsers(); // Refresh user list
        userFormModal.style.display = "none"; // Close modal
    } catch (error) {
        alert("Error saving user: " + error);
    }
});

// Initialize app
fetchUsers();