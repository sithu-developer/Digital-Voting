import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewCategoryItems } from "@/types/categories";
import { prisma } from "@/util/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
        const { newCategory } = req.body as NewCategoryItems;
        if(!newCategory) return res.status(400).send("Bad request");
        const category = await prisma.categories.create({ data : { name : newCategory }});
        return res.status(200).json({ category })
    }
}
