console.log("invoices.js loaded");
let allInvoices = [];
let currentPage = 1;
const pageSize = 10;

document.addEventListener("DOMContentLoaded", () => {
    loadInvoices();
    document.getElementById("searchInvoice")?.addEventListener("input", () => {
        currentPage = 1;
        renderInvoices();
    });
    document.getElementById("prevPage")?.addEventListener("click", () => {
        if (currentPage > 1) { currentPage--; renderInvoices(); }
    });
    document.getElementById("nextPage")?.addEventListener("click", () => {
        const count = filteredInvoices().length;
        if (currentPage < Math.max(1, Math.ceil(count / pageSize))) { currentPage++; renderInvoices(); }
    });
});

async function loadInvoices() {
    const tbody = document.getElementById("invoiceTable");
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="empty">Loading invoices…</td></tr>';
    const { data, error } = await supabaseClient.from("invoices").select("*").order("created_at", { ascending: false });
    if (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="6" class="empty">Could not load invoices: ' + escapeHtml(error.message) + '</td></tr>';
        return;
    }
    allInvoices = data || [];
    currentPage = 1;
    renderInvoices();
}

function filteredInvoices() {
    const q = (document.getElementById("searchInvoice")?.value || "").trim().toLowerCase();
    return allInvoices.filter(inv => [inv.invoice_number, inv.customer_name, inv.service, inv.payment_status, inv.total]
        .some(value => String(value ?? "").toLowerCase().includes(q)));
}

function renderInvoices() {
    const tbody = document.getElementById("invoiceTable");
    const list = filteredInvoices();
    const pages = Math.max(1, Math.ceil(list.length / pageSize));
    currentPage = Math.min(currentPage, pages);
    const start = (currentPage - 1) * pageSize;
    const shown = list.slice(start, start + pageSize);
    if (!shown.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">No invoices match your search.</td></tr>';
    } else {
        tbody.innerHTML = shown.map(inv => {
            const id = String(inv.id ?? "");
            const paid = String(inv.payment_status ?? "").toLowerCase() === "paid";
            const total = Number(inv.total || 0).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
            return '<tr>' +
                '<td><span class="invoice-id">' + escapeHtml(inv.invoice_number || "—") + '</span></td>' +
                '<td><span class="customer-name">' + escapeHtml(inv.customer_name || "—") + '</span></td>' +
                '<td>' + escapeHtml(inv.service || "—") + '</td>' +
                '<td>₹' + total + '</td>' +
                '<td><span class="status ' + (paid ? "paid" : "") + '">' + escapeHtml(inv.payment_status || "Pending") + '</span></td>' +
                '<td><div class="actions"><button class="btn download" onclick="downloadSavedInvoice(\'' + escapeAttr(id) + '\')">↓ Download PDF</button>' +
                '<button class="btn" onclick="editInvoice(\'' + escapeAttr(id) + '\')">Edit</button>' +
                '<button class="btn danger" onclick="deleteInvoice(\'' + escapeAttr(id) + '\')">Delete</button></div></td></tr>';
        }).join("");
    }
    const count = document.getElementById("invoiceCount");
    if (count) count.textContent = list.length ? ('Showing ' + (start + 1) + '–' + Math.min(start + shown.length, list.length) + ' of ' + list.length + ' invoices') : '0 invoices';
    document.getElementById("prevPage").disabled = currentPage <= 1;
    document.getElementById("nextPage").disabled = currentPage >= pages;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function escapeAttr(value) { return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }

function editInvoice(id) {
    window.location.href = "create-invoice.html?id=" + encodeURIComponent(id);
}

async function downloadSavedInvoice(id) {
    const { data: invoice, error } = await supabaseClient.from("invoices").select("*").eq("id", id).single();
    if (error || !invoice) {
        alert("Unable to load this invoice for download. " + (error?.message || ""));
        return;
    }
    const fields = {
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        customer_mobile: invoice.customer_mobile,
        customer_email: invoice.customer_email,
        service: invoice.service,
        description: invoice.description,
        amount: invoice.amount,
        discount: invoice.discount,
        total: invoice.total,
        payment_status: invoice.payment_status,
        payment_method: invoice.payment_method,
        terms: invoice.terms
    };
    Object.entries(fields).forEach(([key, value]) => {
        const field = document.getElementById(key);
        if (field) field.value = value ?? "";
    });
    if (typeof window.downloadInvoicePDF !== "function") {
        alert("The PDF generator did not load. Please refresh and try again.");
        return;
    }
    try {
        window.downloadInvoicePDF();
    } catch (err) {
        console.error(err);
        alert("Could not generate the PDF. Please try again.");
    }
}

async function deleteInvoice(id) {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    const { error } = await supabaseClient.from("invoices").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await loadInvoices();
}
