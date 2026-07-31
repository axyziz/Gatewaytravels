console.log("invoice.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    generateInvoiceNumber();
});

// Generate Invoice Number
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

    let nextNumber = 1;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    if (data && data.length > 0) {

        const lastInvoice = data[0].invoice_number;
        const parts = lastInvoice.split("-");

        if (parts.length === 3) {
            nextNumber = parseInt(parts[2]) + 1;
        }

    }

    document.getElementById("invoice_number").value =
        `GT-${year}${month}-${String(nextNumber).padStart(4, "0")}`;

}

// Calculate Total
function calculateTotal() {

    const amount = Number(document.getElementById("amount").value) || 0;
    const discount = Number(document.getElementById("discount").value) || 0;

    document.getElementById("total").value = amount - discount;

}

// Download Invoice PDF
function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Gateway Travels & Holidays", 20, 20);

    doc.setFontSize(12);
    doc.text("Invoice Number: " + document.getElementById("invoice_number").value, 20, 40);
    doc.text("Customer: " + document.getElementById("customer_name").value, 20, 50);
    doc.text("Mobile: " + document.getElementById("customer_mobile").value, 20, 60);
    doc.text("Service: " + document.getElementById("service").value, 20, 70);
    doc.text("Amount: ₹" + document.getElementById("amount").value, 20, 80);
    doc.text("Discount: ₹" + document.getElementById("discount").value, 20, 90);
    doc.text("Total: ₹" + document.getElementById("total").value, 20, 100);

    doc.save(document.getElementById("invoice_number").value + ".pdf");

}

// Save Invoice
async function saveInvoice() {

    const { error } = await supabaseClient
        .from("invoices")
        .insert([{

            invoice_number: document.getElementById("invoice_number").value,

            customer_name: document.getElementById("customer_name").value,

            customer_mobile: document.getElementById("customer_mobile").value,

            customer_email: document.getElementById("customer_email").value,

            service: document.getElementById("service").value,

            description: document.getElementById("description").value,

            amount: document.getElementById("amount").value,

            discount: document.getElementById("discount").value,

            total: document.getElementById("total").value,

            payment_status: document.getElementById("payment_status").value,

            payment_method: document.getElementById("payment_method").value

        }]);

    if (error) {

        document.getElementById("status").innerHTML = error.message;

    } else {

        document.getElementById("status").innerHTML = "✅ Invoice Saved Successfully";

    }

}
