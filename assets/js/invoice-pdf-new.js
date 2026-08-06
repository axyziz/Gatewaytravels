console.log("invoice-pdf-new.js loaded");

async function downloadInvoicePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p","mm","a4");

    // ===========================
    // GET VALUES
    // ===========================

    const invoiceNo = document.getElementById("invoice_number").value;
    const customer = document.getElementById("customer_name").value;
    const mobile = document.getElementById("customer_mobile").value;
    const email = document.getElementById("customer_email").value;

    const service = document.getElementById("service").value;
    const description = document.getElementById("description").value;

    const amount = Number(document.getElementById("amount").value || 0);
    const discount = Number(document.getElementById("discount").value || 0);
    const total = Number(document.getElementById("total").value || 0);

    const paymentStatus =
        document.getElementById("payment_status").value;

    const paymentMethod =
        document.getElementById("payment_method").value;
const terms =
    document.getElementById("terms").value;
    
    // ===========================
    // HEADER
    // ===========================

    doc.setFillColor(10,61,145);
    doc.rect(0,0,210,55,"F");

    doc.setTextColor(255,255,255);

    doc.setFont("helvetica","bold");
    doc.setFontSize(22);

   doc.text("Gateway Travels & Holidays",15,18);

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);

    doc.text("Your Journey, Our Passion",15,27);
    doc.setFontSize(8);

doc.text(
    "Flights • Hotels • Holiday Packages • Visa • Bus • Car Rental",
    15,
    31
);

    doc.text("+91 73829 64554",15,31);
doc.text("Phone : +91 73829 64554",15,36);

doc.text(
    "Email : gatewaytravelsandholidays@gmail.com",
    15,
    41
);

doc.text(
    "Website : https://axyziz.github.io/Gatewaytravels/",
    15,
    46
);
// ===========================
// INVOICE SUMMARY
// ===========================

doc.setFillColor(255,255,255);
doc.roundedRect(135,10,60,30,2,2,"FD");

doc.setTextColor(10,61,145);

doc.setFont("helvetica","bold");
doc.setFontSize(16);

doc.text("INVOICE",145,16);

doc.setFont("helvetica","normal");
doc.setFontSize(9);

doc.text("Invoice :",145,23);
doc.text(invoiceNo,172,23);

doc.text("Date :",145,29);
doc.text(new Date().toLocaleDateString("en-IN"),172,29);

doc.text("Status :",145,35);

if(paymentStatus==="Paid"){

    doc.setFillColor(22,163,74);
    doc.roundedRect(168,30,22,8,2,2,"F");

    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(8);

    doc.text("PAID",173,35);

}else{

    doc.setFillColor(245,158,11);
    doc.roundedRect(165,30,28,8,2,2,"F");

    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(7);

    doc.text("PENDING",167,35);

}

doc.setTextColor(0);

// ===========================
// CUSTOMER DETAILS
// ===========================

doc.setDrawColor(200);
doc.setFillColor(248,249,250);

doc.roundedRect(15,55,180,45,3,3,"FD");

doc.setTextColor(10,61,145);
doc.setFont("helvetica","bold");
doc.setFontSize(13);

doc.text("BILL TO",20,65);

doc.setDrawColor(220);
doc.line(20,69,190,69);

doc.setTextColor(0);

doc.setFont("helvetica","bold");
doc.setFontSize(12);

doc.text(customer || "-",20,79);

doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text("Mobile : " + (mobile || "-"),20,88);

doc.text("Email : " + (email || "-"),20,96);
  // ===========================
// SERVICE DETAILS
// ===========================

doc.autoTable({

    startY:110,

    head:[
        ["Service","Description","Amount"]
    ],

    body:[[
        service || "-",
        description || "-",
       " Rs." + amount.toLocaleString("en-IN",{
            minimumFractionDigits:2,
            maximumFractionDigits:2
        })
    ]],

    theme:"grid",

    headStyles:{
        fillColor:[10,61,145],
        textColor:[255,255,255],
        fontStyle:"bold",
        halign:"center"
    },

    styles:{
        font:"helvetica",
        fontSize:10,
        cellPadding:4,
        lineColor:[220,220,220],
        lineWidth:0.2,
        overflow:"linebreak"
    },

    columnStyles:{
        0:{cellWidth:35},
        1:{cellWidth:105},
        2:{cellWidth:35,halign:"right"}
    }

});

const tableEndY = doc.lastAutoTable.finalY;
  // ===========================
// TOTALS SECTION
// ===========================

const totalsY = tableEndY + 10;

// Outer box
doc.setDrawColor(200);
doc.roundedRect(110, totalsY, 85, 28, 2, 2);

// Labels
doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text("Subtotal",115,totalsY+8);
doc.text("Discount",115,totalsY+16);

// Values
doc.text(
    "Rs." + amount.toLocaleString("en-IN",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    }),
    190,
    totalsY+8,
    {align:"right"}
);

doc.text(
    "Rs." + discount.toLocaleString("en-IN",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    }),
    190,
    totalsY+16,
    {align:"right"}
);

// Divider
doc.setDrawColor(220);
doc.line(115,totalsY+20,190,totalsY+20);

// Grand Total
doc.setFont("helvetica","bold");
doc.setFontSize(12);

doc.text("Grand Total",115,totalsY+27);

doc.text(
    "Rs." + total.toLocaleString("en-IN",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    }),
    190,
    totalsY+27,
    {align:"right"}
);

const paymentY = totalsY + 40;
  // ===========================
// PAYMENT INFORMATION
// ===========================

// Outer Box
doc.setDrawColor(200);
doc.roundedRect(15, paymentY, 180, 58, 3, 3);

// Blue Header
doc.setFillColor(10,61,145);
doc.rect(15, paymentY, 180, 10, "F");

doc.setTextColor(255,255,255);
doc.setFont("helvetica","bold");
doc.setFontSize(11);

doc.text("PAYMENT INFORMATION",20,paymentY+7);

// Body
doc.setTextColor(0);
doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text("Bank Name",20,paymentY+20);
doc.text(": State Bank of India",65,paymentY+20);

doc.text("Account Name",20,paymentY+30);
doc.text(": Shaik Azeez",65,paymentY+30);

doc.text("IFSC Code",20,paymentY+40);
doc.text(": SBIN0020609",65,paymentY+40);

doc.text("UPI ID",20,paymentY+50);
doc.text(": azizshayk@ybl",65,paymentY+50);
  // ===========================
// FOOTER
// ===========================

const termsY = paymentY + 65;
    // ===========================
// TERMS & CONDITIONS
// ===========================

doc.setDrawColor(200);
doc.roundedRect(15, termsY, 180, 55, 3, 3);

doc.setFillColor(10,61,145);
doc.rect(15, termsY, 180, 10, "F");

doc.setTextColor(255,255,255);
doc.setFont("helvetica","bold");
doc.setFontSize(11);

doc.text("TERMS & CONDITIONS",20,termsY+7);

doc.setTextColor(0);
doc.setFont("helvetica","normal");
doc.setFontSize(9);

// Automatically wrap long text
const wrappedTerms = doc.splitTextToSize(
    terms || "No terms and conditions provided.",
    170
);

// Check if Terms will fit on current page
let currentY = termsY + 18;

const requiredHeight = wrappedTerms.length * 5;

if (currentY + requiredHeight > 270) {

    // Create new page
    doc.addPage();

    currentY = 20;

    // Draw header on new page
    doc.setDrawColor(200);
    doc.roundedRect(15, 10, 180, 10 + requiredHeight, 3, 3);

    doc.setFillColor(10,61,145);
    doc.rect(15,10,180,10,"F");

    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(11);


    doc.setTextColor(0);
    doc.setFont("helvetica","normal");
    doc.setFontSize(9);

    currentY = 28;

}

// Print Terms
doc.text(
    wrappedTerms,
    20,
    currentY
);

// Footer Position
const footerY = currentY + requiredHeight + 15;

doc.setDrawColor(220);
doc.line(15, footerY, 195, footerY);

doc.setFont("helvetica","bold");
doc.setFontSize(11);

doc.text(
    "Thank you for choosing Gateway Travels & Holidays",
    15,
    footerY + 8
);

doc.setFont("helvetica","normal");
doc.setFontSize(9);

doc.text(
    "This is a computer-generated invoice. No signature is required.",
    15,
    footerY + 16
);

// Save PDF
doc.save(invoiceNo + ".pdf");

}
