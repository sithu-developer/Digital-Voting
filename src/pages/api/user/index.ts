import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewUserType } from "@/types/user";
import { prisma } from "@/util/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
      const { email , majorCode } = req.body as NewUserType;
      const isValid = email && majorCode;
      if(!isValid) return res.status(400).send("Bad request");
      const categories = await prisma.categories.findMany({ orderBy : { id : "asc"} });
      const students = await prisma.students.findMany({ orderBy : { id : "asc"} });
      const agendas = await prisma.agenda.findMany({ orderBy : { id : "asc"} });
      const major = await prisma.major.findFirst({ where : { AND : { passCode : majorCode  , majorsOrAdmin : { not : "admin" }}}});
      if(major) {
        const exit = await prisma.user.findUnique({ where : { email }});
        if(exit) {
            const votes = await prisma.votes.findMany({ where : { userId : exit.id }});
            return res.status(200).json({ newUser : exit , categories , students , agendas , votes });
        } else {
            const sameMajorUsers = await prisma.user.findMany({ where : { majorId : major.id }})
            if(sameMajorUsers.length < major.maxQuantity) {
                const newUser = await prisma.user.create({ data : { email , name : "Annonymous" , majorId : major.id }});
                return res.status(200).json({ newUser , categories , students , agendas , votes : [] })
            } else {
                return res.status(200).json({ err : `${major.maxQuantity} votes have been cast for your major !`})
            }
        }
      } else {
        return res.status(200).json({ err : "Wrong Major Code !"})
      }
    }
    
}
