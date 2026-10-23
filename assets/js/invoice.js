console.log("invoice.js loaded");

document.addEventListener("DOMContentLoaded", async () => {

    await loadCustomers();

    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("id");

    if (invoiceId) {
        await loadInvoice(invoiceId);
    } else {
        await generateInvoiceNumber();
    }

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

    if (data && data.length > 0) {

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

    if (!select) return;

    select.innerHTML = `<option value="">Select Customer</option>`;

    const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .order("first_name", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(customer => {

        const option = document.createElement("option");

        option.value = customer.id;

        option.textContent =
            `${customer.first_name ?? ""} ${customer.last_name ?? ""}`;

        option.dataset.name =
            `${customer.first_name ?? ""} ${customer.last_name ?? ""}`;

        option.dataset.mobile = customer.mobile ?? "";
        option.dataset.email = customer.email ?? "";

        select.appendChild(option);

    });

    select.addEventListener("change", fillCustomer);
    document
    .getElementById("service")
    .addEventListener("change", loadDefaultTerms);

}

// =========================
// Fill Customer Details
// =========================

function fillCustomer() {

    const select = document.getElementById("customer_id");

    if (select.selectedIndex < 0) return;

    const option = select.selectedOptions[0];

    document.getElementById("customer_name").value =
        option.dataset.name || "";

    document.getElementById("customer_mobile").value =
        option.dataset.mobile || "";

    document.getElementById("customer_email").value =
        option.dataset.email || "";

}

// =========================
// Load Invoice for Editing
// =========================

async function loadInvoice(id) {

    const { data, error } = await supabaseClient
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    document.getElementById("invoice_number").value =
        data.invoice_number || "";

    document.getElementById("customer_id").value =
        data.customer_id || "";

    fillCustomer();

    document.getElementById("service").value =
        data.service || "";

    document.getElementById("description").value =
        data.description || "";

    document.getElementById("amount").value =
        data.amount || "";

    document.getElementById("discount").value =
        data.discount || "";

    document.getElementById("total").value =
        data.total || "";

    document.getElementById("payment_status").value =
        data.payment_status || "";

    document.getElementById("payment_method").value =
        data.payment_method || "";
    document.getElementById("terms").value =
    data.terms || "";

}
// =========================
// Default Terms
// =========================

function loadDefaultTerms() {

    const service =
        document.getElementById("service").value;

    const terms =
        document.getElementById("terms");

    switch(service){

        case "Flight":

            terms.value =
`• Flight tickets are subject to airline fare rules.
• Tickets once issued may be non-refundable.
• Name changes are not permitted unless allowed by the airline.
• Passengers must carry valid government-issued ID.
• Gateway Travels is not responsible for airline schedule changes or cancellations.`;

            break;

        case "Bus":

            terms.value =
`• Bus timings are subject to operator schedules.
• Passengers should report 30 minutes before departure.
• Cancellation charges apply as per operator policy.
• Seats are subject to availability.
• Gateway Travels acts only as a booking facilitator.`;

            break;

        case "Hotel":

            terms.value =
`• Hotel check-in/check-out timings are as per hotel policy.
• Early check-in and late check-out are subject to availability.
• Any additional charges must be settled directly with the hotel.
• Cancellation policy applies as per hotel rules.`;

            break;

        case "Visa":

            terms.value =
`• Visa approval is solely at the discretion of the respective embassy.
• Visa fees are non-refundable after submission.
• Additional documents may be requested by the embassy.
• Gateway Travels is not responsible for visa rejection.`;

            break;

        case "Holiday Package":

            terms.value =
`• Package prices are subject to availability.
• Any unused services are non-refundable.
• Itinerary may change due to weather or operational reasons.
• Cancellation charges apply as per supplier policy.`;

            break;

        case "Vehicle Rental":

            terms.value =
`• Driver licence is mandatory.
• Fuel, tolls and parking charges are extra unless specified.
• Vehicle must be returned on time.
• Any damages are the customer's responsibility.`;

            break;

    }

}
