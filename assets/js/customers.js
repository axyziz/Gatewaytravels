console.log("customers.js loaded");
// ================================
// Gateway Travels CRM - Customers
// ================================

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

    console.log(data);

    if (data.length === 0) {

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

                <td>
                    ${customer.title ?? ""} ${customer.first_name ?? ""} ${customer.last_name ?? ""}
                </td>

                <td>${customer.mobile ?? ""}</td>

                <td>${customer.email ?? ""}</td>

                <td>${customer.nationality ?? ""}</td>

                <td>
                    Edit | Delete
                </td>

            </tr>
        `;

    });

}
document
    .getElementById("saveCustomerBtn")
    .addEventListener("click", saveCustomer);

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

    console.log(customer);
}
