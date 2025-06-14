let menuData = [
    {
        id: 1,
        image: "",
        name: 'Burger',
        desc: 'Classic beef burger',
        category: 'Main',
        price: 40,
        available: true
    },
    {
        id: 2,
        image: "",
        name: 'Pizza',
        desc: 'Cheese pizza with tomato sauce',
        category: 'Main',
        price: 70,
        available: false
    }
];


orderData = [
    {
        id: 1,
        userName: 'Mohamed Ayman',
        items: ['Burger', 'Coke'],
        status: 'Pending',
        time: '2024-06-13 23:18'
    }
];


document.addEventListener('DOMContentLoaded', () => {
    setupProfileDropdown();
    setupLogout();
    if (document.getElementById('menuTable')) setupMenu();
    if (document.getElementById('ordersTable')) setupOrders();
    setupDialogs();
    setupAccountSave();
});


const restaurantImgInput = document.getElementById('restaurantImgInput');
const restaurantImgPreview = document.getElementById('restaurantImgPreview');
if (restaurantImgInput && restaurantImgPreview) {
    restaurantImgInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                restaurantImgPreview.src = e.target.result;
                restaurantImgPreview.style.display = "block";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}


function setupProfileDropdown() {
    const icon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('profileDropdown');
    if (!icon) return;
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('show')) dropdown.classList.remove('show');
    });
}

function setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (!logoutLink) return;
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogoutDialog();
    });
    let dialog = document.getElementById('logoutConfirmation');
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.id = 'logoutConfirmation';
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <div class="confirmation-dialog-content">
                <p>Are you sure you want to log out?</p>
                <div class="confirmation-dialog-actions">
                    <button class="btn btn-confirm" id="logoutYesBtn">Yes</button>
                    <button class="btn btn-cancel" id="logoutNoBtn">No</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }
    document.getElementById('logoutYesBtn').onclick = () => window.location.href = 'menu.html';
    document.getElementById('logoutNoBtn').onclick = () => dialog.classList.remove('show');
}

function showLogoutDialog() {
    let dialog = document.getElementById('logoutConfirmation');
    dialog.classList.add('show');
}

function setupDialogs() {
    const deleteNoBtn = document.getElementById('deleteNoBtn');
    const menuDeleteDialog = document.getElementById('menuDeleteDialog');
    if (deleteNoBtn && menuDeleteDialog) {
        deleteNoBtn.onclick = () => menuDeleteDialog.classList.remove('show');
    }
    const denyNoBtn = document.getElementById('denyNoBtn');
    const ordersDenyDialog = document.getElementById('ordersDenyDialog');
    if (denyNoBtn && ordersDenyDialog) {
        denyNoBtn.onclick = () => ordersDenyDialog.classList.remove('show');
    }
    const menuModalClose = document.getElementById('menuModalClose');
    const menuModalCancel = document.getElementById('menuModalCancel');
    const menuModal = document.getElementById('menuModal');
    if (menuModalClose && menuModal) {
        menuModalClose.onclick = () => menuModal.classList.remove('show');
    }
    if (menuModalCancel && menuModal) {
        menuModalCancel.onclick = () => menuModal.classList.remove('show');
    }
}

let isRestaurantOpen = false; 

const statusBtn = document.getElementById('restaurantStatusBtn');
const statusDialog = document.getElementById('restaurantStatusDialog');
const statusDialogText = document.getElementById('restaurantStatusDialogText');
const statusYes = document.getElementById('restaurantStatusYesBtn');
const statusNo = document.getElementById('restaurantStatusNoBtn');

function updateStatusBtn() {
    if (isRestaurantOpen) {
        statusBtn.textContent = "Opened";
        statusBtn.style.background = "#26c281";
    } else {
        statusBtn.textContent = "Closed";
        statusBtn.style.background = "#e62429";
    }
}

if (statusBtn && statusDialog && statusDialogText && statusYes && statusNo) {
    updateStatusBtn();

    statusBtn.onclick = function () {
        statusDialogText.textContent = isRestaurantOpen ? "Close restaurant?" : "Open restaurant?";
        statusDialog.classList.add('show');
    };

    statusYes.onclick = function () {
        isRestaurantOpen = !isRestaurantOpen;
        updateStatusBtn();
        statusDialog.classList.remove('show');
    };

    statusNo.onclick = function () {
        statusDialog.classList.remove('show');
    };
}

function setupAccountSave() {
    const accountSaveBtn = document.getElementById('accountSaveBtn');
    const accountMessage = document.getElementById('accountMessage');
    if (accountSaveBtn && accountMessage) {
        accountSaveBtn.onclick = function () {
            accountMessage.textContent = "Profile changes saved!";
            accountMessage.style.display = "block";
            setTimeout(() => {
                accountMessage.style.display = "none";
            }, 1800);
        }
    }
}

function setupMenu() {
    let editingId = null;
    let deletingId = null;
    loadMenu();

    
    const menuImage = document.getElementById('menuImage');
    const menuImagePreview = document.getElementById('menuImagePreview');
    if (menuImage) {
        menuImage.onchange = function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    menuImagePreview.src = e.target.result;
                    menuImagePreview.style.display = "block";
                };
                reader.readAsDataURL(this.files[0]);
            }
        }
    }

    document.getElementById('menuAddButton').onclick = () => {
        editingId = null;
        resetMenuModal();
        showMenuModal();
    };
    document.getElementById('menuModalClose').onclick = hideMenuModal;
    document.getElementById('menuModalCancel').onclick = hideMenuModal;
    document.getElementById('menuSaveBtn').onclick = saveMenuItem;
    document.getElementById('deleteNoBtn').onclick = () => hideDialog('menuDeleteDialog');
    document.getElementById('deleteYesBtn').onclick = confirmDeleteMenu;

    function showMenuModal(item = null) {
        document.getElementById('menuModalTitle').textContent = item ? 'Edit Menu Item' : 'Add Menu Item';
        document.getElementById('menuName').value = item ? item.name : '';
        document.getElementById('menuDesc').value = item ? item.desc : '';
        document.getElementById('menuCategory').value = item ? item.category : '';
        document.getElementById('menuPrice').value = item ? item.price : '';
        document.getElementById('menuAvailable').value = item ? String(item.available) : 'true';
        menuImagePreview.src = item && item.image ? item.image : "";
        menuImagePreview.style.display = item && item.image ? "block" : "none";
        menuImage.value = "";
        document.getElementById('menuModal').classList.add('show');
    }
    function hideMenuModal() {
        document.getElementById('menuModal').classList.remove('show');
    }
    function resetMenuModal() {
        document.getElementById('menuImage').value = "";
        menuImagePreview.src = "";
        menuImagePreview.style.display = "none";
        document.getElementById('menuName').value = "";
        document.getElementById('menuDesc').value = "";
        document.getElementById('menuCategory').value = "";
        document.getElementById('menuPrice').value = "";
        document.getElementById('menuAvailable').value = "true";
    }
    function saveMenuItem() {
        const name = document.getElementById('menuName').value.trim();
        const desc = document.getElementById('menuDesc').value.trim();
        const category = document.getElementById('menuCategory').value.trim();
        const price = parseFloat(document.getElementById('menuPrice').value);
        const available = document.getElementById('menuAvailable').value === "true";
        const image = menuImagePreview.src && menuImagePreview.style.display === "block" ? menuImagePreview.src : "";
        if (!name || !category || isNaN(price)) return;
        const data = { name, desc, category, price, available, image };
        if (editingId) {
            menuData = menuData.map(item => item.id === editingId ? { ...item, ...data } : item);
        } else {
            const nextId = Math.max(...menuData.map(x=>x.id), 0) + 1;
            menuData.push({ ...data, id: nextId });
        }
        hideMenuModal();
        loadMenu();
    }
    function loadMenu() {
        const tbody = document.getElementById('menuTable').querySelector('tbody');
        tbody.innerHTML = '';
        menuData.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.image ? `<img src="${item.image}">` : `<div style="width:48px;height:48px;background:#2c2c2c;border-radius:8px;"></div>`}</td>
                <td>${item.name}</td>
                <td>${item.desc || ''}</td>
                <td>${item.category}</td>
                <td>EGP${item.price}</td>
                <td><span class="badge ${item.available ? 'badge-available' : 'badge-unavailable'}">${item.available ? 'Yes' : 'No'}</span></td>
                <td class="action-btns">
                    <button class="btn btn-edit" data-id="${item.id}">✏️</button>
                    <button class="btn btn-delete" data-id="${item.id}">🗑️</button>
                </td>
            `;
            tr.querySelector('.btn-edit').onclick = () => {
                editingId = item.id;
                showMenuModal(item);
            };
            tr.querySelector('.btn-delete').onclick = () => {
                deletingId = item.id;
                showDialog('menuDeleteDialog');
            };
            tbody.appendChild(tr);
        });
    }
    function confirmDeleteMenu() {
        if (!deletingId) return;
        menuData = menuData.filter(item => item.id !== deletingId);
        deletingId = null;
        hideDialog('menuDeleteDialog');
        loadMenu();
    }
}


function setupOrders() {
    let unlockingId = null; 
    let denyingId = null;

    
    orderData = [
        {
            id: 1,
            userName: 'Mohamed Ayman',
            items: ['Burger', 'Coke'],
            status: 'Pending'
        }
    ];

    menuData = [
        { id: 1, name: 'Burger', price: 40 },
        { id: 2, name: 'Coke', price: 15 }
    ];

    loadOrders();

    document.getElementById('denyNoBtn').onclick = () => hideDialog('ordersDenyDialog');
    document.getElementById('denyYesBtn').onclick = confirmDenyOrder;

    function getOrderTotal(items) {
        let total = 0;
        if (!Array.isArray(items)) return total;
        items.forEach(name => {
            const found = menuData.find(m => m.name === name);
            if (found) total += Number(found.price) || 0;
        });
        return total;
    }

    function loadOrders() {
        const tbody = document.getElementById('ordersTable').querySelector('tbody');
        tbody.innerHTML = '';
        orderData.forEach(order => {
            const tr = document.createElement('tr');
            let isPending = order.status === 'Pending';
            let isDenied = order.status === 'Denied';
            let isDone = order.status === 'Done';
            let unlocked = unlockingId === order.id && isPending;
            if(isPending) tr.className = 'orders-status-pending';
            else if(isDone) tr.className = 'orders-status-done';
            else if(isDenied) tr.className = 'denied-row';

            
            const tdId = document.createElement('td');
            tdId.textContent = String(order.id).padStart(4,'0');
            tr.appendChild(tdId);

            
            const tdUser = document.createElement('td');
            tdUser.textContent = order.userName || '';
            tr.appendChild(tdUser);

            
            const tdItems = document.createElement('td');
            tdItems.textContent = Array.isArray(order.items) ? order.items.join(', ') : '';
            tr.appendChild(tdItems);

            
            const tdTotal = document.createElement('td');
            tdTotal.textContent = "EGP" + getOrderTotal(order.items).toFixed(2);
            tr.appendChild(tdTotal);

            
            const tdTime = document.createElement('td');
            tdTime.textContent = order.time || '';
            tr.appendChild(tdTime);
            
            const tdStatus = document.createElement('td');
            const select = document.createElement('select');
            select.className = 'status-select';
            select.disabled = !unlocked;
            ['Pending', 'Done'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if(order.status === status) option.selected = true;
                select.appendChild(option);
            });
            select.onchange = function() {
                const newStatus = this.value;
                if (newStatus === "Done") {
                    order.status = "Done";
                    unlockingId = null;
                } else if (newStatus === "Pending") {
                    order.status = "Pending";
                }
                loadOrders();
            };
            tdStatus.appendChild(select);
            tr.appendChild(tdStatus);

            
            const tdActions = document.createElement('td');
            tdActions.className = 'action-btns';

            
            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'btn btn-confirm';
            btnConfirm.textContent = '✔️';
            btnConfirm.disabled = (!isPending || unlocked || isDenied);
            btnConfirm.onclick = () => {
                unlockingId = order.id;
                loadOrders();
            };
            tdActions.appendChild(btnConfirm);

            
            const btnDeny = document.createElement('button');
            btnDeny.className = 'btn btn-deny';
            btnDeny.textContent = '❌';
            btnDeny.disabled = !isPending;
            btnDeny.onclick = () => {
                denyingId = order.id;
                showDialog('ordersDenyDialog');
            };
            tdActions.appendChild(btnDeny);

            tr.appendChild(tdActions);

            tbody.appendChild(tr);
        });
    }

    function confirmDenyOrder() {
        if (!denyingId) return;
        orderData = orderData.map(o => o.id === denyingId ? { ...o, status: 'Denied' } : o);
        denyingId = null;
        unlockingId = null;
        hideDialog('ordersDenyDialog');
        loadOrders();
    }
}



function showDialog(id) {
    document.getElementById(id).classList.add('show');
}
function hideDialog(id) {
    document.getElementById(id).classList.remove('show');
}
