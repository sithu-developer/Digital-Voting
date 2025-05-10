import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { NewStudentItems, UpdatedStudentItems } from "@/types/student";

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
        if(!isValid) return res.status(400).send("Bad request");
        const newStudent = await prisma.students.create({ data : { categoryId , contestantNumber , name , major , year , zodiacId , url }});
        return res.status(200).json({ newStudent })
    } else if(method === "PUT") {
        const { id , contestantNumber , name , year , major , zodiacId , url } = req.body as UpdatedStudentItems;
        const isValid = id && contestantNumber && name && major && year && zodiacId !== undefined && url;
        if(!isValid) return res.status(400).send("Bad request");
        const isExit = await prisma.students.findUnique({ where : { id }});
        if(!isExit) return res.status(400).send("Bad request");
        const updatedStudent = await prisma.students.update({ where : { id } , data : { contestantNumber , name , year , major , zodiacId , url }});
        return res.status(200).json({ updatedStudent })
    } else if(method === "DELETE") {
        const studentId = Number(req.query.studentId)
        if(!studentId) return res.status(400).send("Bad request");
        const isExit = await prisma.students.findUnique({ where : { id : studentId }});
        if(!isExit) return res.status(400).send("Bad request");
        const deletedVotes = await prisma.votes.findMany({ where : { studentId }});
        await prisma.votes.deleteMany({ where : { studentId }});
        await prisma.students.delete({ where : { id : studentId }});
        return res.status(200).json({ deletedStudentId : studentId , deletedVotes })
    }
}
