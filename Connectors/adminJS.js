document.addEventListener('DOMContentLoaded', async () => {
    //FOR POST REQUEST
    const conversionCategory = document.getElementById('conversionCategory');
    const name = document.getElementById('conversionName');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const formula = document.getElementById('formula');
    const parameter = document.getElementById('parameter');

    //FOR PUT REQUEST
    const updateCategory = document.getElementById('updateCategory');
    const updateName = document.getElementById('updateName');
    const updateFromUnit = document.getElementById('updateFromUnit');
    const updateToUnit = document.getElementById('updateToUnit');
    const updateFormula = document.getElementById('updateFormula');
    const updateParameter = document.getElementById('updateParameter');

    //DELETE REQUEST
    const deleteName = document.getElementById('deleteName');

    //ADMIN LOGIN
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');

    //FOR THE SUBMISSIONS
    const post = document.getElementById('post');
    const put = document.getElementById('put');
    const remove = document.getElementById('remove');
    const login = document.getElementById('login');

    let jwToken = sessionStorage.getItem('adminjwtkey');
    // Login link HTML page to API
    if (login) login.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: adminUsername.value,
                    password: adminPassword.value
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                jwToken = result.token;
                sessionStorage.setItem('adminjwtkey', jwToken);
                adminPassword.value = "";
            } else {
                // API sends JSON error, result is text here, so parse it
                try {
                    const errData = result.error;
                    alert(`Login failed: ${errData || 'Unknown error'}`);
                } catch (e) {
                    alert(`Login failed: ${result}`); // Fallback to raw text if not JSON
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    if (post) post.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!jwToken) {
            alert("Please login first");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/admin/conversions/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${jwToken}`
                },
                body: JSON.stringify({
                    name: name.value,
                    category: conversionCategory.value,
                    fromUnit: fromUnit.value,
                    toUnit: toUnit.value,
                    formula: formula.value,
                    parameter: parameter.value
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(`Error adding Conversion to DB ${result.error}`);
            }
        } catch (error) {
            console.error('Error during adding process:', error);
            alert(`Sorry an error occurred while trying to add conversion: ${error.message}`);
        }
    });

    if (put) put.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!jwToken) {
            alert("Please login first");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/admin/conversions/${updateName.value}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json',
                'Authorization' : `Bearer ${jwToken}`
                },
                body: JSON.stringify({
                    name: updateName.value,
                    category: updateCategory.value,
                    fromUnit: updateFromUnit.value,
                    toUnit: updateToUnit.value,
                    formula: updateFormula.value,
                    parameter: updateParameter.value
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(`Error updating Conversion in DB ${result.error}`);
            }
        } catch (error) {
            console.error('Error during updating process:', error);
            alert(`Sorry an error occurred while trying to update conversion: ${error.message}`);
        }
    });

    if (remove) remove.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!jwToken) {
            alert("Please login first");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/admin/conversions/${deleteName.value}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${jwToken}`
                },
            });
            if (response.status === 204) {
                alert(`Conversion '${deleteName.value}' deleted successfully.`);
                deleteName.value = ''; // Clear input on success
            } else if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const result = await response.json();
                alert(`Error deleting Conversion from DB: ${result.error}`); 
            }
        }
        catch (error) {
            console.error('Error during removing process:', error);
            alert(`Sorry an error occurred while trying to remove conversion: ${error.message}`);
        }
    });
});
