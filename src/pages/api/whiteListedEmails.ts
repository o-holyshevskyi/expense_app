import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserRoles } from '../../../auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fs.readFile('./whitelisted_emails.json', 'utf-8');
    const whiteListedEmails = JSON.parse(data);

    const whiteListedEmailsWithRoles = await Promise.all(
      whiteListedEmails.whiteListedEmails.map(async (emailObj: { email: string }) => {
        const roles = await getUserRoles(emailObj.email);
        return { ...emailObj, roles };
      })
    );
    
    res.status(200).json(whiteListedEmailsWithRoles);
  } catch (error: any) {
    console.error("Failed to read whitelisted_emails.json", error);
    res.status(500).json({ error: 'Failed to fetch white-listed emails', message: error.message });
  }
}
