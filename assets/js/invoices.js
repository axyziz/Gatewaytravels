console.log("invoices.js loaded");
let invoiceCache = [];

document.addEventListener("DOMContentLoaded", () => {
  loadInvoices();
  document.getElementById("searchInvoice")?.addEventListener("input", renderInvoices);
});

async function loadInvoices() {
  const tbody = document.getElementById("invoiceTable");
  tbody.innerHTML = '<tr><td colspan="6" class="empty">Loading invoices…</td></tr>';
  const { data, error } = await supabaseClient.from("invoices").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Could not load invoices: ' + escapeHtml(error.message) + '</td></tr>';
    return;
  }
  invoiceCache = data || [];
  renderInvoices();
}

function renderInvoices() {
  const tbody = document.getElementById("invoiceTable");
  const q = (document.getElementById("searchInvoice")?.value || "").trim().toLowerCase();
  const rows = invoiceCache.filter(inv => [inv.invoice_number, inv.customer_name, inv.service, inv.payment_status].some(v => String(v || "").toLowerCase().includes(q)));
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">No matching invoices found.</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(inv => {
    const id = escapeHtml(String(inv.id));
    const status = String(inv.payment_status || "Pending").toLowerCase();
    return '<tr>' +
      '<td><strong>' + escapeHtml(inv.invoice_number || "—") + '</strong></td>' +
      '<td>' + escapeHtml(inv.customer_name || "—") + '</td>' +
      '<td>' + escapeHtml(inv.service || "—") + '</td>' +
      '<td>₹' + money(inv.total) + '</td>' +
      '<td><span class="status ' + (status === "paid" ? "paid" : "pending") + '">' + escapeHtml(inv.payment_status || "Pending") + '</span></td>' +
      '<td><div class="actions"><button onclick="editInvoice(\'' + id + '\')">Edit</button>' +
      '<button class="danger" onclick="deleteInvoice(\'' + id + '\')">Delete</button>' +
      '<button class="download" onclick="downloadInvoice(\'' + id + '\')">Download PDF</button></div></td></tr>';
  }).join("");
}

function money(value) {
  return Number(value || 0).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function editInvoice(id) { window.location.href = "create-invoice.html?id=" + encodeURIComponent(id); }

async function deleteInvoice(id) {
  const inv = invoiceCache.find(row => String(row.id) === String(id));
  if (!confirm("Delete invoice " + (inv?.invoice_number || "") + "? This cannot be undone.")) return;
  const { error } = await supabaseClient.from("invoices").delete().eq("id", id);
  if (error) { alert("Could not delete invoice: " + error.message); return; }
  await loadInvoices();
}

function downloadInvoice(id) {
  // Generate the PDF using the existing original invoice PDF generator.
  // The create page loads the saved invoice and triggers downloadInvoicePDF().
  let frame = document.getElementById("invoiceDownloadFrame");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "invoiceDownloadFrame";
    frame.style.display = "none";
    document.body.appendChild(frame);
  }
  frame.src = "create-invoice.html?id=" + encodeURIComponent(id) + "&download=1";
}
