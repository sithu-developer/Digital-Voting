import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { RevotedStudentItems, VotedStudentItems } from "@/types/vote";
import { prisma } from "@/util/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
        const { studentId , userId } = req.body as VotedStudentItems;
        const isValid = studentId && userId;
        if(!isValid) return res.status(400).send("Bad request");
        const exitStudent = await prisma.user.findUnique({ where : { id : userId }});
        if(!exitStudent) return res.status(400).send("Bad request");
        const isAlreadyVote = await prisma.votes.findFirst({ where : { AND : { studentId , userId }}});
        if(isAlreadyVote) return res.status(400).send("Already Voted");
        const newVote = await prisma.votes.create({ data : { studentId , userId }});
        return res.status(200).json({ newVote })
    } else if( method === "PUT") {
        const { id , studentId } = req.body as RevotedStudentItems;
        const isValid = id && studentId;
        if(!isValid) return res.status(400).send("Bad request");
        const exit = await prisma.votes.findUnique({ where : { id }});
        if(!exit) return res.status(400).send("Bad request");
        const updatedVote = await prisma.votes.update({ where : { id } , data : { studentId }});
        return res.status(200).json({ updatedVote })
    }
}
