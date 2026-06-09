export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = JSON.parse(req.body);
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const DC = API_KEY.split('-')[1]; // us21 gibi bir şey

  const response = await fetch(
    `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' }),
    }
  );

  const data = await response.json();

  if (response.ok) return res.status(200).json({ success: true });
  if (data.title === 'Member Exists') return res.status(200).json({ success: true }); // zaten aboneyse sorun çıkarma
  return res.status(500).json({ error: data.detail });
}
