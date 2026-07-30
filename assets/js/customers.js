console.log("customers.js loaded");

// ================================
// Gateway Travels CRM - Customers
// ================================

document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("saveCustomerBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", saveCustomer);
    }
});

async function initCustomers() {

    console.log("Customers page loaded");

    await loadCustomers();

}

async function loadCustomers() {

    const tbody = document.getElementById("customerTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:red;">
                    ${error.message}
                </td>
            </tr>
        `;

        return;

    }

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No customers found
                </td>
            </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    data.forEach(customer => {

        tbody.innerHTML += `
            <tr>

                <td>${customer.title ?? ""} ${customer.first_name ?? ""} ${customer.last_name ?? ""}</td>

                <td>${customer.mobile ?? ""}</td>

                <td>${customer.email ?? ""}</td>

                <td>${customer.nationality ?? ""}</td>

                <td>
                    <button onclick="editCustomer(${customer.id})">Edit</button>
                    <button onclick="deleteCustomer(${customer.id})">Delete</button>
                </td>

            </tr>
        `;

    });

}

async function saveCustomer() {

    const customer = {
        title: document.getElementById("title").value,
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        nationality: document.getElementById("nationality").value,
        passport_no: document.getElementById("passport_no").value,
        passport_expiry: document.getElementById("passport_expiry").value || null,
        dob: document.getElementById("dob").value || null,
        company: document.getElementById("company").value,
        gst_number: document.getElementById("gst_number").value,
        address: document.getElementById("address").value
    };

    const { error } = await supabaseClient
        .from("customers")
        .insert([customer]);

    if (error) {

        console.error(error);
        alert(error.message);
        return;

    }

    alert("Customer saved successfully!");

    clearForm();

    await loadCustomers();

}

function clearForm() {

    document.getElementById("customerId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";
    document.getElementById("nationality").value = "";
    document.getElementById("passport_no").value = "";
    document.getElementById("passport_expiry").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("company").value = "";
    document.getElementById("gst_number").value = "";
    document.getElementById("address").value = "";

}

async function editCustomer(id) {

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        alert(error.message);
        return;

    }

    document.getElementById("customerId").value = data.id;
    document.getElementById("title").value = data.title || "";
    document.getElementById("first_name").value = data.first_name || "";
    document.getElementById("last_name").value = data.last_name || "";
    document.getElementById("mobile").value = data.mobile || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("nationality").value = data.nationality || "";
    document.getElementById("passport_no").value = data.passport_no || "";
    document.getElementById("passport_expiry").value = data.passport_expiry || "";
    document.getElementById("dob").value = data.dob || "";
    document.getElementById("company").value = data.company || "";
    document.getElementById("gst_number").value = data.gst_number || "";
    document.getElementById("address").value = data.address || "";

}

async function deleteCustomer(id) {

    if (!confirm("Delete this customer?")) return;

    const { error } = await supabaseClient
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    await loadCustomers();

}
