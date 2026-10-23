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
      '<button class="download" onclick="downloadInvoice(\'' + id + '\')">↓ PDF</button></div></td></tr>';
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
  const inv = invoiceCache.find(row => String(row.id) === String(id));
  if (!inv) { alert("Invoice data not found. Please refresh the page."); return; }
  if (!window.jspdf?.jsPDF) { alert("PDF library did not load. Check your internet connection and try again."); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");
  const left = 18, right = 192;
  doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(11,61,145);
  doc.text("Gateway Travels & Holidays", left, 20);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(90);
  doc.text("Your Journey, Our Passion", left, 27);
  doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(20);
  doc.text("INVOICE", right, 20, {align:"right"});
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Invoice No: " + (inv.invoice_number || "—"), left, 40);
  doc.text("Date: " + new Date(inv.created_at || inv.invoice_date || Date.now()).toLocaleDateString("en-IN"), left, 47);
  doc.text("Payment status: " + (inv.payment_status || "Pending"), right, 40, {align:"right"});
  doc.setDrawColor(210); doc.line(left, 54, right, 54);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(11,61,145);
  doc.text("BILL TO", left, 64);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(30);
  let y = 72;
  const customerLines = [inv.customer_name, inv.customer_mobile, inv.customer_email].filter(Boolean);
  customerLines.forEach(line => { doc.text(doc.splitTextToSize(String(line), 170), left, y); y += 6; });
  y += 4; doc.setDrawColor(210); doc.line(left, y, right, y); y += 10;
  doc.setFont("helvetica", "bold"); doc.setTextColor(11,61,145);
  doc.text("SERVICE", left, y); doc.text("AMOUNT", right, y, {align:"right"});
  y += 7; doc.setFont("helvetica", "normal"); doc.setTextColor(30);
  doc.text(String(inv.service || "—"), left, y);
  const description = doc.splitTextToSize(String(inv.description || "—"), 125);
  doc.text(description, 60, y);
  doc.text("Rs. " + money(inv.amount), right, y, {align:"right"});
  y += Math.max(8, description.length * 5 + 3);
  doc.setDrawColor(210); doc.line(left, y, right, y); y += 9;
  doc.text("Subtotal: Rs. " + money(inv.amount), right, y, {align:"right"}); y += 7;
  doc.text("Discount: Rs. " + money(inv.discount), right, y, {align:"right"}); y += 9;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(11,61,145);
  doc.text("Grand Total: Rs. " + money(inv.total), right, y, {align:"right"}); y += 13;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(40);
  if (inv.payment_method) { doc.text("Payment method: " + String(inv.payment_method), left, y); y += 7; }
  if (inv.terms) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(11,61,145);
    doc.text("TERMS & CONDITIONS", left, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(40);
    const terms = doc.splitTextToSize(String(inv.terms), 174);
    terms.forEach(line => { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, left, y); y += 4; });
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90);
  if (y < 275) doc.text("Thank you for choosing Gateway Travels & Holidays.", left, Math.max(y + 10, 270));
  doc.save((inv.invoice_number || "invoice") + ".pdf");
}