import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, isListed } = req.body;
    const data = await fs.readFile('./whitelisted_emails.json', 'utf-8');
    const whiteListedEmails = JSON.parse(data);
    const date = new Date(Date.now());
    const formattedDate = date.toLocaleDateString('uk-UA').replace(/\./g, '/');

    // Get time formatted as "12:34:56"
    const formattedTime = date.toLocaleTimeString('uk-UA');

    // Combine both date and time
    const changed = `${formattedDate} ${formattedTime}`; 

    const updatedEmails = whiteListedEmails.whiteListedEmails.map((emailObj: any) =>
      emailObj.email === email ? { ...emailObj, isListed, changed } : emailObj
    );

    await fs.writeFile('./whitelisted_emails.json', JSON.stringify({ whiteListedEmails: updatedEmails }, null, 2));

    res.status(200).json({ message: 'Email status updated successfully' });
  } catch (error: any) {
    console.error("Failed to update whitelisted_emails.json", error);
    res.status(500).json({ error: 'Failed to update white-listed emails', message: error.message });
  }
}
