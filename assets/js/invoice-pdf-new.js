console.log("invoice-pdf-new.js loaded");

async function downloadInvoicePDF() {
 const {jsPDF}=window.jspdf,doc=new jsPDF("p","mm","a4");
 const val=id=>document.getElementById(id)?.value||"";
 const invoiceNo=val("invoice_number"),customer=val("customer_name"),mobile=val("customer_mobile"),email=val("customer_email");
 const service=val("service"),description=val("description"),amount=Number(val("amount")||0),discount=Number(val("discount")||0),total=Number(val("total")||0),paymentStatus=val("payment_status"),paymentMethod=val("payment_method"),terms=val("terms");
 let biz={business_name:"Gateway Travels & Holidays",tagline:"Your Journey, Our Passion",phone:"",email:"gatewaytravelsandholidays@gmail.com",website:"https://axyziz.github.io/Gatewaytravels/"};
 let cfg={brandColor:"#0a3d91",upiId:"azizshayk@ybl",paymentMethods:"UPI",paymentInstructions:"",footerMessage:"Thank you for choosing Gateway Travels & Holidays"};
 let qrDataUrl=null;
 try {
  const {data:auth}=await supabaseClient.auth.getSession();
  if(auth?.session){
   const {data:b}=await supabaseClient.from("business_settings").select("*").eq("id","default").maybeSingle();if(b)biz={...biz,...b};
   const {data:r}=await supabaseClient.from("invoice_settings").select("settings,qr_path").eq("id","default").maybeSingle();
   if(r?.settings)cfg={...cfg,...r.settings};
   const path=r?.qr_path||cfg.qrPath;
   if(path){const {data:u}=await supabaseClient.storage.from("gateway-payment-qr").createSignedUrl(path,300);if(u?.signedUrl){const response=await fetch(u.signedUrl);if(response.ok){const blob=await response.blob();qrDataUrl=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=reject;fr.readAsDataURL(blob);});}}}
  }
 } catch(e){console.warn("Invoice settings could not be loaded; using safe defaults.",e);}
 const hex=(cfg.brandColor||"#0a3d91").replace("#","");const rgb=hex.length===6?[parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)]:[10,61,145];
 const brand=biz.business_name||"Gateway Travels & Holidays",tagline=biz.tagline||"",phone=biz.phone||"",bizEmail=biz.email||"",website=biz.website||"";
 doc.setFillColor(...rgb);doc.rect(0,0,210,55,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(18);doc.text(brand,15,17);
 doc.setFont("helvetica","normal");doc.setFontSize(9);if(tagline)doc.text(tagline,15,26);
 doc.setFontSize(8);doc.text("Flights • Hotels • Holiday Packages • Visa • Bus • Vehicle Rental",15,32);
 let y=38;if(phone){doc.text("Phone: "+phone,15,y);y+=5;}if(bizEmail){doc.text("Email: "+bizEmail,15,y);y+=5;}if(website)doc.text("Website: "+website,15,y);
 doc.setFillColor(255,255,255);doc.roundedRect(135,10,60,30,2,2,"FD");doc.setTextColor(...rgb);doc.setFont("helvetica","bold");doc.setFontSize(15);doc.text("INVOICE",145,16);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.text("Invoice:",145,23);doc.text(invoiceNo,171,23);doc.text("Date:",145,29);doc.text(new Date().toLocaleDateString("en-IN"),171,29);doc.text("Status:",145,35);
 if(paymentStatus==="Paid"){doc.setFillColor(22,163,74);doc.roundedRect(168,30,22,8,2,2,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("PAID",173,35);}else{doc.setFillColor(245,158,11);doc.roundedRect(165,30,28,8,2,2,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(7);doc.text("PENDING",167,35);}
 doc.setTextColor(0);doc.setDrawColor(210);doc.roundedRect(15,62,180,45,3,3,"FD");doc.setTextColor(...rgb);doc.setFont("helvetica","bold");doc.setFontSize(13);doc.text("BILL TO",20,72);doc.setDrawColor(220);doc.line(20,76,190,76);doc.setTextColor(0);doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text(customer||"-",20,86);doc.setFont("helvetica","normal");doc.setFontSize(10);doc.text("Mobile: "+(mobile||"-"),20,95);doc.text("Email: "+(email||"-"),20,103);
 doc.autoTable({startY:110,head:[["Service","Description","Amount"]],body:[[service||"-",description||"-","Rs."+amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]],theme:"grid",headStyles:{fillColor:rgb,textColor:[255,255,255],fontStyle:"bold",halign:"center"},styles:{font:"helvetica",fontSize:10,cellPadding:4,lineColor:[220,220,220],lineWidth:0.2,overflow:"linebreak"},columnStyles:{0:{cellWidth:35},1:{cellWidth:105},2:{cellWidth:35,halign:"right"}}});
 const totalsY=doc.lastAutoTable.finalY+10;doc.setDrawColor(200);doc.roundedRect(110,totalsY,85,28,2,2);doc.setFont("helvetica","normal");doc.setFontSize(10);doc.text("Subtotal",115,totalsY+8);doc.text("Discount",115,totalsY+16);doc.text("Rs."+amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}),190,totalsY+8,{align:"right"});doc.text("Rs."+discount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}),190,totalsY+16,{align:"right"});doc.setDrawColor(220);doc.line(115,totalsY+20,190,totalsY+20);doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text("Grand Total",115,totalsY+27);doc.text("Rs."+total.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}),190,totalsY+27,{align:"right"});
 const paymentY=totalsY+40;doc.setDrawColor(200);doc.roundedRect(15,paymentY,180,46,3,3);doc.setFillColor(...rgb);doc.rect(15,paymentY,180,10,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.text("PAYMENT INFORMATION",20,paymentY+7);doc.setTextColor(0);doc.setFont("helvetica","normal");doc.setFontSize(9);
 let payY=paymentY+17;doc.setFont("helvetica","bold");doc.text("Bank Name:",20,payY);doc.setFont("helvetica","normal");doc.text("State Bank of India",48,payY);payY+=5;doc.setFont("helvetica","bold");doc.text("Account Name:",20,payY);doc.setFont("helvetica","normal");doc.text("Shaik Azeez",48,payY);payY+=5;doc.setFont("helvetica","bold");doc.text("IFSC Code:",20,payY);doc.setFont("helvetica","normal");doc.text("SBIN0020609",48,payY);payY+=5;if(cfg.upiId){doc.setFont("helvetica","bold");doc.text("UPI ID:",20,payY);doc.setFont("helvetica","normal");doc.text(cfg.upiId,48,payY);payY+=5;}
 if(phone){doc.setFont("helvetica","bold");doc.text("Mobile:",20,payY);doc.setFont("helvetica","normal");doc.text(phone,48,payY);payY+=5;}
 if(qrDataUrl){try{const format=qrDataUrl.startsWith("data:image/png")?"PNG":"JPEG";doc.addImage(qrDataUrl,format,157,paymentY+13,29,29);}catch(e){console.warn("QR could not be embedded in PDF",e);}}
 else if(cfg.upiId){doc.setFontSize(7);doc.text("Use UPI ID to pay",157,paymentY+27);}
 // Render terms once in a compact first-page section.
 // Keep the entire terms block and footer within the A4 page bounds.
 const termsY = Math.min(paymentY + 53, 220);
 const rawTerms = terms || "No terms and conditions provided.";
 const termsX = 20, termsWidth = 170;
 const pageBottom = 278;
 const headingHeight = 11;
 const footerReserve = 13;
 const availableTextHeight = Math.max(12, pageBottom - (termsY + headingHeight) - footerReserve);
 let termsFont = 8, wrappedTerms = [], lineHeight = 3.5;
 while (termsFont >= 5) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(termsFont);
  wrappedTerms = doc.splitTextToSize(rawTerms, termsWidth);
  lineHeight = termsFont <= 5.5 ? 2.4 : termsFont <= 6.5 ? 2.8 : termsFont <= 7.5 ? 3.1 : 3.5;
  if (wrappedTerms.length * lineHeight <= availableTextHeight) break;
  termsFont -= 0.5;
 }
 // If the terms still exceed the space, use a smaller readable layout and
 // do not create another terms section or spill the text onto a second page.
 doc.setPage(1);
 const textHeight = Math.min(availableTextHeight, wrappedTerms.length * lineHeight);
 const boxHeight = headingHeight + textHeight + 4;
 doc.setDrawColor(200);
 doc.roundedRect(15, termsY, 180, boxHeight, 3, 3);
 doc.setFillColor(...rgb);
 doc.rect(15, termsY, 180, 9, "F");
 doc.setTextColor(255, 255, 255);
 doc.setFont("helvetica", "bold");
 doc.setFontSize(10);
 doc.text("TERMS & CONDITIONS", 20, termsY + 6.2);
 doc.setTextColor(0);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(termsFont);
 doc.text(wrappedTerms, termsX, termsY + headingHeight, { lineHeightFactor: 1.0, maxWidth: termsWidth });
 const footerY = Math.min(termsY + boxHeight + 3, 279);
 doc.setDrawColor(220);
 doc.line(15, footerY, 195, footerY);
 doc.setFont("helvetica", "bold");
 doc.setFontSize(8);
 doc.text(String(cfg.footerMessage || ("Thank you for choosing " + brand)).slice(0, 100), 15, footerY + 5);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(7);
 doc.text("This is a computer-generated invoice. No signature is required.", 15, footerY + 10);
 doc.save((invoiceNo||"invoice")+".pdf");
}