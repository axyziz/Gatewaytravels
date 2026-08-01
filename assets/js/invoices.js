console.log("invoices.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    loadInvoices();
});

// =============================
// Load Invoices
// =============================

async function loadInvoices() {

    const tbody = document.getElementById("invoiceTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await supabaseClient
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="color:red;text-align:center;">
                    ${error.message}
                </td>
            </tr>
        `;

        return;

    }

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No invoices found.
                </td>
            </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    data.forEach(invoice => {

        tbody.innerHTML += `
            <tr>

                <td>${invoice.invoice_number}</td>

                <td>${invoice.customer_name}</td>

                <td>${invoice.service}</td>

                <td>₹${invoice.total}</td>

                <td>${invoice.payment_status}</td>

                <td>

                    <button onclick="editInvoice('${invoice.id}')">
                        Edit
                    </button>

                    <button onclick="deleteInvoice('${invoice.id}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

// =============================
// Edit Invoice
// =============================

function editInvoice(id) {

    window.location.href =
        "create-invoice.html?id=" + id;

}

// =============================
// Delete Invoice
// =============================

async function deleteInvoice(id) {

    if (!confirm("Delete this invoice?"))
        return;

    const { error } = await supabaseClient
        .from("invoices")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    alert("Invoice deleted successfully.");

    loadInvoices();

}
