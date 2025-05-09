function toggleEditForm(button) {
    const form = button.closest('.menu-item').querySelector('.edit-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function saveEdit(button) {
    const form = button.closest('.edit-form');
    const menuItem = button.closest('.menu-item');
    const name = form.querySelector('input:nth-child(1)').value;
    const category = form.querySelector('input:nth-child(2)').value;
    const price = form.querySelector('input:nth-child(3)').value;

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert('Meal name should contain only letters.');
        return;
    }
    if (!/^[a-zA-Z\s]+$/.test(category)) {
        alert('Category should contain only letters.');
        return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        alert('Price should be a valid number.');
        return; 
    }
    menuItem.querySelector('.menu-item-info span').innerHTML = `
        <strong>${name}</strong><br>
        Category: ${category}<br>
        Price: ${price}
    `;
    toggleEditForm(button);
}

function showConfirmation(button) {
    const confirmationDialog = document.getElementById('confirmation-dialog');
    confirmationDialog.style.display = 'block';
    window.confirmingRemoveButton = button.closest('.menu-item');
}

function hideConfirmation() {
    document.getElementById('confirmation-dialog').style.display = 'none';
}

function removeItemConfirmed() {
    const menuItem = window.confirmingRemoveButton;
    menuItem.remove();
    hideConfirmation();
}

function addMeal() {
    const name = document.getElementById('meal-name').value;
    const category = document.getElementById('meal-category').value;
    const price = document.getElementById('meal-price').value;

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert('Meal name should contain only letters.');
        return;
    }
    if (!/^[a-zA-Z\s]+$/.test(category)) {
        alert('Category should contain only letters.');
        return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        alert('Price should be a valid number.');
        return;
    }

    const menuList = document.querySelector('.menu-list');
    const newItem = document.createElement('li');
    newItem.classList.add('menu-item');
    newItem.innerHTML = `
        <div class="menu-item-info">
            <span>
                <strong>${name}</strong><br>
                Category: ${category}<br>
                Price: ${price}
            </span>
            <div class="menu-item-actions">
                <button class="btn btn-edit" onclick="toggleEditForm(this)">Edit</button>
                <button class="btn btn-remove" onclick="showConfirmation(this)">Remove</button>
            </div>
        </div>
        <form class="edit-form">
            <input type="text" placeholder="Meal Name">
            <input type="text" placeholder="Category">
            <input type="text" placeholder="Price">
            <button type="button" class="btn btn-save" onclick="saveEdit(this)">Save</button>
            <button type="button" class="btn btn-cancel" onclick="toggleEditForm(this)">Cancel</button>
        </form>
    `;
    menuList.appendChild(newItem);

    document.getElementById('meal-name').value = '';
    document.getElementById('meal-category').value = '';
    document.getElementById('meal-price').value = '';
}

function showMessage(orderItem, type) {
    const messageBox = orderItem.querySelector(".message");
    if (type === "confirm") {
        messageBox.textContent = "Order confirmed!";
        messageBox.classList.remove("denied-message");
    } else if (type === "deny") {
        messageBox.textContent = "Order denied.";
        messageBox.classList.add("denied-message");
    }
    messageBox.style.display = "block";
}

function updateStatus(orderItem, status) {
    orderItem.classList.remove("pending", "done");

    if (status === "pending") {
        orderItem.classList.add("pending");
    } else if (status === "done") {
        orderItem.classList.add("done");
    }
}

function validateAndSave(button) {
    const name = document.getElementById('restaurant-name');
    const email = document.getElementById('restaurant-email');
    const password = document.getElementById('restaurant-password');
    const phone = document.getElementById('restaurant-phone');
    const message = document.getElementById('confirmation-message');

    const nameRegex = /^[A-Za-z\s]+$/;
    const numOnly = /^[0-9]+$/;

    if (!nameRegex.test(name.value)) {
        alert("Name must contain letters and spaces only.");
        name.focus();
        return;
    }

    if (!numOnly.test(password.value)) {
        alert("Password must contain numbers only.");
        password.focus();
        return;
    }

    if (!numOnly.test(phone.value)) {
        alert("Phone number must contain numbers only.");
        phone.focus();
        return;
    }

    if (!email.checkValidity()) {
        alert("Please enter a valid email address.");
        email.focus();
        return;
    }

    message.style.display = "block";
    message.textContent = "Profile saved successfully!";
}