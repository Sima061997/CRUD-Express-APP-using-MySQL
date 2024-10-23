
    let form = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    
    const userIdInput = document.getElementById('userId');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();     // Prevent default form submission
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('http://localhost:3000/add-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    Name: name,
                }),
            });
            // Check if the response is plain text or JSON
        const contentType = response.headers.get('content-type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();  // Parse JSON if the response is JSON
        } else {
            responseData = await response.text();  // Handle plain text response
        }
            if(!response.ok) {
                throw new Error(responseData);
            }
            console.log(responseData);          // Display success message or error
            alert(responseData);            // Show an alert to the user with the response
             // Clear the form inputs after successful submission
        form.reset();  // This will clear all the input fields
        } catch (error) {
            console.error('Error submitting form: ', error);
            alert(`Error: ${error.message}`);
        }
    });

