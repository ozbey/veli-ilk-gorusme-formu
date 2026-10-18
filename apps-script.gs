// Veli İlk Görüşme Formu -> mail. script.google.com'a yapıştırıp Web uygulaması olarak dağıtın.
const ALICI = "mozbey@oguzkaan.k12.tr";

function doPost(e) {
  // e.parameter sırayı garanti etmez; soruların sırası korunsun diye ham gövdeyi biz ayrıştırıyoruz
  const alanlar = e.postData.contents.split("&").filter(Boolean).map(p => {
    const [k, v = ""] = p.split("=").map(s => decodeURIComponent(s.replace(/\+/g, " ")));
    return [k, v];
  });
  const al = k => (alanlar.find(([a]) => a === k) || [])[1] || "";

  if (al("_honey")) return sonuc(); // spam botu: sessizce geç

  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const satirlar = alanlar
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:600;vertical-align:top">${esc(k)}</td>` +
                     `<td style="padding:6px 10px;border:1px solid #ddd">${esc(v) || "—"}</td></tr>`)
    .join("");

  const veli = al("E-posta").trim();
  MailApp.sendEmail({
    to: ALICI,
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(veli) ? veli : ALICI, // "Yanıtla" doğrudan veliye gitsin
    subject: al("_subject") || "Veli İlk Görüşme Formu",
    htmlBody: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${satirlar}</table>`,
  });
  return sonuc();
}

function sonuc() {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;text-align:center;padding:60px 16px">' +
    '<h2>Teşekkürler!</h2><p>Formunuz öğretmenimize iletildi.</p></div>'
  ).addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Dağıtmadan önce mail yetkisi vermek ve denemek için editörde bunu çalıştırın.
function test() {
  doPost({ postData: { contents: "_subject=Test&%C3%96%C4%9Frencinin+Ad%C4%B1+Soyad%C4%B1=Deneme+%C3%96%C4%9Frenci&1.+Soru=Cevap+%3Cb%3E" } });
}
