console.log("invoice-pdf.js loaded");

async function downloadInvoicePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    const invoiceNo = document.getElementById("invoice_number").value;
    const customer = document.getElementById("customer_name").value;
    const mobile = document.getElementById("customer_mobile").value;
    const email = document.getElementById("customer_email").value;
    const service = document.getElementById("service").value;
    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value || 0);
    const discount = Number(document.getElementById("discount").value || 0);
    const total = Number(document.getElementById("total").value || 0);
    const paymentStatus = document.getElementById("payment_status").value;
    const paymentMethod = document.getElementById("payment_method").value;

  // ==========================
// PROFESSIONAL HEADER
// ==========================

doc.setFillColor(10,61,145);
doc.rect(0,0,210,42,"F");

// Company Name
doc.setTextColor(255,255,255);
doc.setFont("helvetica","bold");
doc.setFontSize(22);
doc.text("Gateway Travels & Holidays",15,15);

// Tagline
doc.setFont("helvetica","normal");
doc.setFontSize(11);
doc.text("Your Journey, Our Passion",15,22);

// Contact
doc.setFontSize(9);

doc.text("Phone : +91 73829 64554",15,31);
doc.text("Email : gatewaytravelsandholidays@gmail.com",15,37);

// Invoice Title
doc.setFont("helvetica","bold");
doc.setFontSize(26);
doc.text("INVOICE",155,22);

// Number
doc.setFont("helvetica","normal");
doc.setFontSize(10);
doc.text("Invoice No : " + invoiceNo,145,30);

    // Title


  // ==========================
// CUSTOMER CARD
// ==========================

doc.setDrawColor(200);
doc.setFillColor(250,250,250);
doc.roundedRect(15,55,180,45,3,3,"FD");

doc.setTextColor(10,61,145);
doc.setFont("helvetica","bold");
doc.setFontSize(13);
doc.text("BILL TO",20,65);

doc.setDrawColor(220);
doc.line(20,68,190,68);

doc.setTextColor(0);
doc.setFont("helvetica","bold");
doc.setFontSize(12);
doc.text(customer,20,78);

doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text("Mobile : " + mobile,20,87);

doc.text("Email : " + email,20,95);
    // Service Table

    doc.autoTable({

        startY:110,

        head:[
            ["Service","Description","Amount"]
        ],

        body:[[
            service,
            description,
            "₹ " + amount.toFixed(2)
        ]],

        theme:"grid",

       headStyles:{
    fillColor:[10,61,145],
    textColor:[255,255,255],
    fontStyle:"bold",
    halign:"center"
},

styles:{
    fontSize:10,
    cellPadding:4,
    valign:"middle"
},

columnStyles:{
    2:{halign:"right"}
}

    });
const y = doc.lastAutoTable.finalY + 12;
   // ==========================
// TOTALS BOX
// ==========================

doc.setDrawColor(180);
doc.roundedRect(120, y-8, 75, 35, 3, 3, "S");

doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text("Subtotal",125,y);

doc.text(
    "₹ " + amount.toFixed(2),
    190,
    y,
    {align:"right"}
);

doc.text("Discount",125,y+8);

doc.text(
    "₹ " + discount.toFixed(2),
    190,
    y+8,
    {align:"right"}
);

doc.setDrawColor(210);
doc.line(125,y+12,190,y+12);

doc.setFont("helvetica","bold");
doc.setFontSize(12);

doc.text("Grand Total",125,y+22);

doc.text(
    "₹ " + total.toFixed(2),
    190,
    y+22,
    {align:"right"}
);

// ==========================
// PAYMENT DETAILS
// ==========================

doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text(
    "Payment Status : " + paymentStatus,
    20,
    y+45
);

doc.text(
    "Payment Method : " + (paymentMethod || "-"),
    20,
    y+53
);
    doc.setFontSize(10);

const footerY = Math.max(y + 70, 270);

doc.setFontSize(10);

doc.text(
    "Thank you for choosing Gateway Travels & Holidays",
    20,
    footerY
);

doc.save(invoiceNo + ".pdf");

}
