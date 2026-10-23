console.log("invoice.js loaded");

document.addEventListener("DOMContentLoaded", async () => {

    await loadCustomers();

    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("id");

    if (invoiceId) {
        await loadInvoice(invoiceId);
        if (params.get("download") === "1") {
            // Use the existing original PDF generator without changing its layout.
            setTimeout(() => downloadInvoicePDF(), 350);
        }
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
    const service = document.getElementById("service").value;
    const terms = document.getElementById("terms");
    const defaults = {
      "Flight": `1. Tickets are subject to airline fare rules and conditions.
2. Check passenger names, dates and destinations before ticket issuance; changes may incur fees.
3. Cancellations, refunds, rescheduling, no-shows and name corrections follow airline rules.
4. Refunds, where permitted, are processed after the airline releases funds; timelines vary.
5. Arrive within the airline's reporting time and carry valid photo ID and required travel documents.
6. Baggage allowance, meals, seats and check-in deadlines depend on the airline and fare.
7. Airline delays, diversions, schedule changes and cancellations are handled under airline policy.
8. Passengers are responsible for passport validity, visas, transit requirements and destination entry rules.
9. Any disclosed agency service fee may be non-refundable once the service has been performed, subject to applicable law.
10. Gateway Travels cannot override airline rules or guarantee operational outcomes.`,
      "Bus": `1. Tickets are subject to seat availability and the bus operator's conditions.
2. Check passenger names, travel date, boarding and dropping points, departure time and contact details immediately.
3. Reach the boarding point at least 30 minutes before departure, or earlier if the operator advises.
4. Delays and schedule changes may occur due to traffic, weather, road conditions or operational reasons.
5. Boarding or dropping points may change; check the latest ticket and operator notifications.
6. Cancellation and rescheduling charges follow the operator's policy and the ticket's stated cancellation window.
7. Refund eligibility, deductions and processing times depend on the operator and payment provider.
8. Missing the bus or arriving late may result in no refund, subject to the ticket terms and applicable law.
9. Seat numbers or seat types may change for operational or safety reasons.
10. Amenities such as AC, charging, blankets, water, Wi-Fi and live tracking are not guaranteed unless confirmed.
11. Luggage must comply with operator size, weight and safety restrictions; hazardous items are prohibited.
12. Carry the ticket and valid photo ID; child travel and special assistance follow operator rules.
13. Pets, extra luggage, infants and unaccompanied minors are subject to operator restrictions.
14. For urgent boarding updates, use the operator contact details on the ticket.
15. Gateway Travels facilitates the booking but does not operate the bus or control its route and timing.
16. If the operator cancels the trip, alternatives and refunds are handled under its policy and applicable law.
17. Optional insurance or add-ons are governed by the separate terms disclosed at purchase.
18. Final ticket conditions and applicable consumer-protection law apply; no term excludes rights that cannot legally be excluded.`,
      "Hotel": `1. Check-in and check-out times follow the hotel's confirmed policy and voucher.
2. Early check-in, late check-out, upgrades and special requests depend on availability and may cost extra.
3. Guests must present valid identification and any deposit or payment required by the property.
4. Room type, occupancy, bedding and meal plan are as stated on the confirmed voucher.
5. Cancellation, amendment, no-show and early-departure charges follow the booked rate plan.
6. Refunds depend on hotel policy and supplier processing.
7. Taxes, deposits, meals, minibar, damage and incidental charges may be payable directly by the guest.
8. Facilities and amenities may change or close for maintenance or operational reasons.
9. Guests must follow property rules, occupancy limits and local laws.
10. Gateway Travels cannot guarantee requests not confirmed by the hotel.`,
      "Visa": `1. Visa issuance is solely at the discretion of the relevant authority; approval is not guaranteed.
2. Application submission or fee payment does not guarantee a visa.
3. Applicants must provide accurate, complete and genuine documents within the requested timeline.
4. Interviews, biometrics, medical checks or additional documents may be required.
5. Processing times are estimates and may change; travel is not confirmed until the visa is granted.
6. Government and application fees are generally non-refundable once paid, subject to authority rules.
7. Incorrect information, missing documents or immigration history may cause delay or refusal.
8. Travellers must check passport validity, transit visa requirements and entry conditions.
9. Gateway Travels provides assistance only and cannot influence authority decisions or timelines.
10. Check visa name, validity, entries and stay period before travel.`,
      "Holiday Package": `1. Inclusions, exclusions, dates, hotels, transport and activities are as listed in the confirmed itinerary.
2. Prices and availability remain subject to supplier confirmation until booking is confirmed.
3. Flights, hotels, tours and transfers may have separate cancellation and amendment rules.
4. Submit change or cancellation requests in writing; charges depend on supplier terms and timing.
5. Refunds depend on amounts recovered from suppliers, less disclosed non-refundable charges permitted by law.
6. Unused services, missed tours or voluntary early departure are not refundable unless the supplier agrees.
7. Itineraries may change due to weather, safety, traffic, local restrictions or operational requirements.
8. Travellers are responsible for passports, visas, insurance and destination entry requirements.
9. Meals, baggage, entrance tickets, tips, taxes and personal expenses are included only if stated.
10. Rooming and special requests are requests unless confirmed in writing.
11. Arrive on time for departures and keep itinerary and supplier contact details available.
12. Travel insurance is recommended and governed by the insurer's policy.
13. These terms do not remove consumer rights that cannot legally be excluded.`,
      "Vehicle Rental": `1. Vehicle category and availability are subject to supplier confirmation.
2. Carry valid identification and a driving licence where self-drive is booked.
3. Rental duration and pickup/drop-off times follow the voucher; late return may incur charges.
4. Fuel, tolls, parking, permits, interstate fees, driver allowance and taxes are included only if stated.
5. Damage, loss and fines are handled under the rental agreement and applicable law.
6. Route changes, extra kilometres, waiting time and additional stops may attract charges.
7. Driver working hours and mandatory rest periods must be respected.
8. An equivalent vehicle may be substituted for safety or operational reasons, subject to availability.
9. Cancellations and refunds follow the rental supplier's policy.
10. Do not exceed passenger/luggage capacity or use the vehicle unlawfully.
11. Report delays, breakdowns or accidents promptly to the supplier.
12. Gateway Travels facilitates the booking and does not operate the vehicle unless expressly stated.`
    };
    terms.value = defaults[service] || "";
    const heading = document.getElementById("termsHeading");
    if (heading) heading.textContent = service + " — Terms & Conditions";
}
