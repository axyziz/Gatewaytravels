console.log("invoice.js loaded");

document.addEventListener("DOMContentLoaded", async () => {

    await generateInvoiceNumber();
    await loadCustomers();

});

// =========================
// Generate Invoice Number
// =========================

async function generateInvoiceNumber() {

    const { data, error } = await supabaseClient
        .from("invoices")
        .select("invoice_number")
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    let next = 1;

    if (data.length > 0) {

        const last = data[0].invoice_number;
        const num = parseInt(last.replace("GT-", ""));
        next = num + 1;

    }

    document.getElementById("invoice_number").value =
        "GT-" + String(next).padStart(4, "0");

}

// =========================
// Load Customers
// =========================

async function loadCustomers() {

    const select = document.getElementById("customer_id");

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("first_name");

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(customer => {

        const option = document.createElement("option");

        option.value = customer.id;

        option.text =
            `${customer.first_name} ${customer.last_name}`;

        option.dataset.mobile = customer.mobile;
        option.dataset.email = customer.email;
        option.dataset.name =
            `${customer.first_name} ${customer.last_name}`;

        select.appendChild(option);

    });

    select.addEventListener("change", fillCustomer);

}

// =========================
// Fill Customer Details
// =========================

function fillCustomer() {

    const option =
        document.getElementById("customer_id").selectedOptions[0];

    document.getElementById("customer_name").value =
        option.dataset.name || "";

    document.getElementById("customer_mobile").value =
        option.dataset.mobile || "";

    document.getElementById("customer_email").value =
        option.dataset.email || "";

}
