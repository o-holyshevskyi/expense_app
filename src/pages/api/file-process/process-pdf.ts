import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from "openai";
import ExpencesResponse from "@/shared/interfaces/api/expenses";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey });

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const form = formidable({ uploadDir: '/tmp', keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'Error parsing the file.' });

        const file = files.file?.[0];
        if (!file || !file.filepath) return res.status(400).json({ error: 'No file uploaded.' });

        const dataBuffer = fs.readFileSync(file.filepath);
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

        const prompt = `
            Extract data from the following bank statement PDF text and return a structured JSON object according to the schema below. 
            Many fields in the schema may not be present in all PDFs - in those cases, use null or empty strings as appropriate rather than inventing data.

            SCHEMA:
            {
                "accountStatement": {
                    "statementNumber": string,
                    "accountType": string,
                    "bankName": string,
                    "period": {
                        "startDate": string,  // Format as DD-MM-YYYY
                        "endDate": string     // Format as DD-MM-YYYY
                    },
                    "accountDetails": {
                        "accountNumber": string,
                        "accountOwner": string,
                        "accountCurrency": string,
                        "bankCode": string,
                        "iban": string,
                        "bic": string
                    },
                    "basicAccountData": {
                        "initialBalance": number,
                        "totalRecieved": number,
                        "totalWithdrawn": number,
                        "finalBalance": number,
                        "reservationOfFunds": number,
                        "availableBalance": number
                    },
                    "transactions": [
                        {
                            "date": string,  // Format as DD-MM-YYYY
                            "description": string, // Use the primary description of the transaction
                            "amount": number,          // Always include the sign (+ for deposits, - for withdrawals)
                            "counterAccountNumber": string | null,
                            "transactionDetails": {
                                "location": string | null,
                                "name": string | null,
                                "variableSymbol": string | null,
                                "constantSymbol": string | null,
                                "specificSymbol": string | null,
                                "description": string | null, // Include any additional descriptive text
                                "category": string | null // Categorize based on rules below
                            }
                        }
                    ],
                    "finalBalance": number,
                    "accountServices": [string]
                }
            }

            TRANSACTION CATEGORIZATION RULES:

            1. If counterAccountNumber is "3566980339/0800", categorize as "Rent"
            2. If description contains "Tesco" or "Billa", categorize as "Food"
            3. If description contains "ATM" or "Cash", categorize as "Cash Withdrawal" for negative amounts and "Cash Deposit" for positive amounts
            4. If description contains words like "salary", "wage", "payroll", categorize as "Income"
            5. If description contains "restaurant", "cafe", "dining", "uncle van", categorize as "Restaurant"
            6. If description contains "transfer" and "savings", categorize as "Savings"
            7. If description contains "transfer" and "investment", categorize as "Investment"
            8. If description contains "transfer" and "loan", categorize as "Loan"
            9. If description contains "transfer" and "credit card", categorize as "Credit Card"
            10. If description contains "Amazon", "shopping", "retail", "store", categorize as "Shopping"
            11. If description contains "utility", "electricity", "water", "gas", "phone", "internet", categorize as "Utilities"
            12. If description contains "transport", "taxi", "uber", "train", "bus", categorize as "Transportation"
            13. If description contains "health", "doctor", "medical", "pharmacy", categorize as "Healthcare"
            14. If description contains "entertainment", "movie", "theatre", "concert", categorize as "Entertainment"
            15. For card payments that don't match any other category, use "General Expenses"
            16. If none of the above apply, use "Uncategorized"

            PARSING INSTRUCTIONS:
            1. For each transaction row:
                - Extract the date in format YYYY-MM-DD (convert from DD.MM.YYYY if needed)
                - Determine if amount is positive (deposit) or negative (withdrawal)
                - Look for counter account numbers in format XXXXXXXX/XXXX
                - Extract any variable/constant/specific symbols when available
                - For card payments, extract locations and merchant names
                - For cash deposits/withdrawals, note ATM locations if available
            2. Calculate totalReceived as sum of all positive amounts
            3. Calculate totalWithdrawn as sum of all negative amounts (as positive number)
            4. Calculate finalBalance as initialBalance + totalReceived - totalWithdrawn
            5. If account owner name appears in transactions (like "HOLYSHEVSKYI/OLEKSANDR"), use it for accountDetails.accountOwner
            6. If currency is mentioned (like "CZK"), use it for accountDetails.accountCurrency

            The totalWithdrawn must be always equls to the sum of all transactions amounts;

            Return only valid JSON without any explanation or markdown.

            PDF Text:
            ${extractedText}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "You are a JSON generator. You will receive a prompt and you will generate a JSON object that matches the schema." },
                { role: "user", content: prompt },
            ],
            temperature: 0,
        });

        const aiReply = response.choices[0].message?.content?.replace(/^\s*```json\s*([\s\S]*?)\s*```/gm, '$1').trim() || '';

        try {
            const json = JSON.parse(aiReply ?? '{}') as ExpencesResponse;
            res.status(200).json({json});
        } catch {
            res.status(200).json({ raw: aiReply });
        }
    });
}

export default handler;
