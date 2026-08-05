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


// Contact
doc.setFontSize(9);

doc.text("Phone : +91 73829 64554",15,31);
doc.text("Email : gatewaytravelsandholidays@gmail.com",15,37);

// ==========================
// INVOICE SUMMARY BOX
// ==========================

doc.setFillColor(255,255,255);
doc.roundedRect(135,8,60,28,2,2,"FD");

doc.setTextColor(10,61,145);

doc.setFont("helvetica","bold");
doc.setFontSize(16);
doc.text("INVOICE",145,16);

doc.setFont("helvetica","normal");
doc.setFontSize(9);
    doc.setCharSpace(0.0);
doc.setLineHeightFactor(1);

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

doc.setTextColor(10,61,145);

doc.setFont("helvetica","normal");

doc.setFontSize(9);


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
    // Reset font after autoTable
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);
 // ==========================
// TOTALS TABLE
// ==========================

doc.autoTable({

    startY: y - 5,

    theme: "grid",

    tableWidth: 90,

    margin: { left: 105 },

    styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200,200,200],
        lineWidth: 0.2
    },

    columnStyles: {
        0: {
            cellWidth: 45,
            fontStyle: "normal"
        },
        1: {
            cellWidth: 45,
            halign: "right"
        }
    },

    body: [

        [
            "Subtotal",
            "₹ " + amount.toLocaleString("en-IN", {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })
        ],

        [
            "Discount",
            "₹ " + discount.toLocaleString("en-IN", {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })
        ],

        [
            "Grand Total",
            "₹ " + total.toLocaleString("en-IN", {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            })
        ]

    ],

    didParseCell: function(data){

        if(data.row.index===2){

            data.cell.styles.fontStyle="bold";
            data.cell.styles.fillColor=[240,248,255];

        }

    }

});

const paymentY = doc.lastAutoTable.finalY + 12;

// ==========================
// PAYMENT INFORMATION
// ==========================

doc.setDrawColor(180);
doc.roundedRect(15, paymentY, 180, 55, 3, 3, "S");

// Blue Header
doc.setFillColor(10,61,145);
doc.rect(15, paymentY, 180, 10, "F");

doc.setTextColor(255,255,255);
doc.setFont("helvetica","bold");
doc.setFontSize(11);
doc.text("PAYMENT INFORMATION",20,paymentY+7);

// Payment Details
doc.text("Bank Name",20,paymentY+20);
doc.text(": State Bank of India",65,paymentY+20);

doc.text("Account Name",20,paymentY+28);
doc.text(": Shaik Azeez",65,paymentY+28);

doc.text("IFSC Code",20,paymentY+36);
doc.text(": SBIN0020609",65,paymentY+36);

doc.text("UPI ID",20,paymentY+44);
doc.text(": azizshayk@ybl",65,paymentY+44);


// ==========================
// FOOTER
// ==========================

const footerY = Math.max(y + 105, 270);

doc.setDrawColor(220);
doc.line(15, footerY - 8, 195, footerY - 8);

doc.setFont("helvetica","bold");
doc.setFontSize(11);

doc.text(
    "Thank you for choosing Gateway Travels & Holidays",
    15,
    footerY
);

doc.setFont("helvetica","normal");
doc.setFontSize(9);

doc.text(
    "This is a computer-generated invoice. No signature is required.",
    15,
    footerY + 8
);

// Save PDF
doc.save(invoiceNo + ".pdf");

}
