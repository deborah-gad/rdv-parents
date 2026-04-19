const https = require("https");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { nom_enfant, email, jour, heure, heure_fin } = JSON.parse(event.body);

  const data = JSON.stringify({
    from: "Mme Gad - Rendez-vous <onboarding@resend.dev>",
    to: email,
    subject: "Confirmation de votre rendez-vous - Suivi de scolarité semestre 2",
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #2c3e50; padding: 20px;">
        <p>Bonjour,</p>
        <p>Votre rendez-vous de suivi de scolarité pour <strong>${nom_enfant}</strong> a bien été enregistré.</p>
        <p>📅 Date : <strong>${jour}</strong><br>
        🕐 Heure : <strong>${heure} - fin ${heure_fin}</strong></p>
        <p>Je vous remercie d'avoir pris rendez-vous.</p>
        <p>Cordialement,<br><strong>Mme Gad</strong></p>
        <hr>
        <p style="color: #999; font-size: 12px;">Ceci est un mail automatique, merci de ne pas y répondre.</p>
      </div>
    `
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      }
    }, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: body
        });
      });
    });
    req.write(data);
    req.end();
  });
};
