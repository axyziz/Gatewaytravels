console.log("invoice.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    generateInvoiceNumber();

});

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
