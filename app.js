document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userIdInput = document.getElementById('userId');

    // Fetch all users when page loads
    fetchUsers();

    // Add or Update a User
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const userId = userIdInput.value;

        // Ensure all fields are filled out
        if (!name || !email || !password) {
            alert('All fields are required.');
            return;
        }

        // Determine whether to create or update a user
        if (userId) {
            // Update user
            fetch(`/api/Users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update user');
                return response.json();
            })
            .then(() => {
                resetForm();
                fetchUsers();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            // Create new user
            fetch('/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password }) // Include password when creating a user
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to create user');
                return response.json();
            })
            .then(() => {
                resetForm();
                fetchUsers();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Fetch all users
    function fetchUsers() {
        fetch('/api/users')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        })
        .then(data => {
            userList.innerHTML = ''; // Clear the user list
            data.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${user.name} (${user.email})
                    <div>
                        <button class="edit" data-id="${user.id}">Edit</button>
                        <button class="delete" data-id="${user.id}">Delete</button>
                    </div>
                `;
                userList.appendChild(li);

                // Edit user event
                li.querySelector('.edit').addEventListener('click', () => {
                    nameInput.value = user.name;
                    emailInput.value = user.email;
                    passwordInput.value = user.password; // Assume the password is being returned; otherwise, you may want to handle this differently
                    userIdInput.value = user.id;
                });

                // Delete user event
                li.querySelector('.delete').addEventListener('click', () => {
                    deleteUser(user.id);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }

    // Delete a user
    function deleteUser(id) {
        fetch(`/api/users/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete user');
            return fetchUsers(); // Refresh the user list after deletion
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }

    // Reset the form after adding/updating
    function resetForm() {
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        userIdInput.value = '';
    }
});
