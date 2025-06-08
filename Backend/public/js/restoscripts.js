let menuData = [
    { id: 1, name: 'Burger', category: 'Main', price: 40, available: true },
    { id: 2, name: 'Pizza', category: 'Main', price: 70, available: false },
    { id: 3, name: 'Coke', category: 'Drinks', price: 15, available: true }
];

let orderData = [
    {
        id: 1,
        userName: 'Mohamed Ayman',
        mobile: '01012345678',
        items: ['Burger', 'Coke'],
        status: 'Pending'
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

    document.getElementById('menuAddButton').onclick = () => {
        editingId = null;
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
        document.getElementById('menuCategory').value = item ? item.category : '';
        document.getElementById('menuPrice').value = item ? item.price : '';
        document.getElementById('menuAvailable').value = item ? String(item.available) : 'true';
        document.getElementById('menuModal').classList.add('show');
    }
    function hideMenuModal() {
        document.getElementById('menuModal').classList.remove('show');
    }
    function saveMenuItem() {
        const name = document.getElementById('menuName').value.trim();
        const category = document.getElementById('menuCategory').value.trim();
        const price = parseFloat(document.getElementById('menuPrice').value);
        const available = document.getElementById('menuAvailable').value === "true";
        if (!name || !category || isNaN(price)) return;
        const data = { name, category, price, available };
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
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${item.price}</td>
                <td><span class="badge ${item.available ? 'badge-available' : 'badge-unavailable'}">${item.available ? 'Yes' : 'No'}</span></td>
                <td class="action-btns">
                    <button class="btn btn-edit" data-id="${item.id}">✏</button>
                    <button class="btn btn-delete" data-id="${item.id}">🗑</button>
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
    let unlockingId = null; // row id for which dropdown will be enabled
    let denyingId = null;
    loadOrders();

    document.getElementById('denyNoBtn').onclick = () => hideDialog('ordersDenyDialog');
    document.getElementById('denyYesBtn').onclick = confirmDenyOrder;

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

            tr.innerHTML = `
                <td>${String(order.id).padStart(4,'0')}</td>
                <td>${order.userName || ''}</td>
                <td>${order.mobile || ''}</td>
                <td>${Array.isArray(order.items) ? order.items.join(', ') : ''}</td>
                <td>
                    <select class="status-select" ${unlocked ? "" : "disabled"}>
                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Done" ${order.status === "Done" ? "selected" : ""}>Done</option>
                    </select>
                </td>
                <td class="action-btns">
                    <button class="btn btn-confirm" data-id="${order.id}" 
                        ${(!isPending || unlocked || isDenied) ? "disabled" : ""}>✔</button>
                    <button class="btn btn-deny" data-id="${order.id}" 
                        ${!isPending ? "disabled" : ""}>❌</button>
                </td>
            `;

            // Tick: unlocks dropdown only
            const confirmBtn = tr.querySelector('.btn-confirm');
            confirmBtn.onclick = () => {
                unlockingId = order.id;
                loadOrders();
            };

            // Dropdown: handles manual change (only unlocked row)
            const statusSelect = tr.querySelector('.status-select');
            statusSelect.onchange = function() {
                const newStatus = this.value;
                if (newStatus === "Done") {
                    order.status = "Done";
                    unlockingId = null;
                } else if (newStatus === "Pending") {
                    order.status = "Pending";
                    // Keep unlocked so user can change again if needed
                }
                loadOrders();
            };

            // X: denies order instantly
            const denyBtn = tr.querySelector('.btn-deny');
            denyBtn.onclick = () => {
                denyingId = order.id;
                showDialog('ordersDenyDialog');
            };

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