import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { put } from '@vercel/blob';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
        const filename = String(req.query.filename);
        if (!filename) return res.status(400).json({ error: 'Missing filename' });
        const blob = await put(filename, req, {
          access: 'public',
          addRandomSuffix: true,
        });
        return res.status(200).json(blob);
    }
}
