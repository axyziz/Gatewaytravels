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
