import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { NewStudentItems } from "@/types/student";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
        const { categoryId , contestantNumber , name , major , year , zodiacId , url } = req.body as NewStudentItems;
        const isValid = categoryId && contestantNumber && name && major && year && zodiacId !== undefined && url;
        console.log(isValid)
        if(!isValid) return res.status(400).send("Bad request");
        const newStudent = await prisma.students.create({ data : { categoryId , contestantNumber , name , major , year , zodiacId , url }});
        return res.status(200).json({ newStudent })
    }
}
