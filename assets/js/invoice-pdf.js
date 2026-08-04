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

doc.text("📞 +91 73829 64554",15,31);

doc.text("✉ gatewaytravelsandholidays@gmail.com",15,37);

// Invoice Title
doc.setFont("helvetica","bold");
doc.setFontSize(26);
doc.text("INVOICE",155,22);

// Number
doc.setFont("helvetica","normal");
doc.setFontSize(10);
doc.text("Invoice No : " + invoiceNo,145,30);

    // Title

    doc.setTextColor(0);

    doc.setFontSize(24);
    doc.text("INVOICE",15,48);

    doc.setFontSize(11);

    doc.text("Invoice No :",15,58);
    doc.text(invoiceNo,45,58);

    doc.text("Date :",140,58);
    doc.text(new Date().toLocaleDateString("en-IN"),155,58);

    // Customer

    doc.setFillColor(245,245,245);
    doc.rect(15,68,180,40,"F");

    doc.setFontSize(13);
    doc.text("Bill To",20,78);

    doc.setFontSize(11);
    doc.text(customer,20,88);
    doc.text(mobile,20,95);
    doc.text(email,20,102);

    // Service Table

    doc.autoTable({

        startY:118,

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
            fillColor:[11,61,145],
            textColor:255
        }

    });

    const y = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(11);

    doc.text("Discount",130,y);
    doc.text("₹ "+discount.toFixed(2),185,y,{align:"right"});

    doc.text("Grand Total",130,y+10);
    doc.text("₹ "+total.toFixed(2),185,y+10,{align:"right"});

    doc.line(125,y+15,190,y+15);

    doc.text("Payment Status : "+paymentStatus,20,y+28);
    doc.text("Payment Method : "+paymentMethod,20,y+38);

    doc.setFontSize(10);

    doc.text(
        "Thank you for choosing Gateway Travels & Holidays",
        20,
        280
    );

    doc.save(invoiceNo + ".pdf");

}
