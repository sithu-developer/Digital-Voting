import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewAdminType } from "@/types/admin";
import { prisma } from "@/util/prisma";
import { Major } from "../../../../generated/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
      const { email , password } = req.body as NewAdminType;
      const isValid = email && password;
      if(!isValid) return res.status(400).send("Bad request");
      const adminInMajor = await prisma.major.findUnique({ where : { majorsOrAdmin : "admin" }}) as Major;
      const exitedAdmins = await prisma.admin.findMany({ where : { adminMajorId : adminInMajor.id }});
      if(adminInMajor.passCode === password) {
        const exit = await prisma.admin.findUnique({ where : { email }})
        if(exit) {
          const categories = await prisma.categories.findMany({ orderBy : { id : 'asc'}});
          const students = await prisma.students.findMany({ orderBy : { id : 'asc'}})
          const votes = await prisma.votes.findMany({ orderBy : { id : 'asc'}})
          return res.status(200).json({ newAdmin : exit  , categories , students , votes})
        } else {
          if( exitedAdmins.length < adminInMajor.maxQuantity ) {
            const newAdmin = await prisma.admin.create({ data : { email , adminMajorId : adminInMajor.id }})
            const categories = await prisma.categories.findMany({ orderBy : { id : 'asc'}});
            const students = await prisma.students.findMany({ orderBy : { id : 'asc'}})
            const votes = await prisma.students.findMany({ orderBy : { id : 'asc'}})
            if(categories.length) {
              return res.status(200).json({ newAdmin , categories , students , votes })
            } else {
              const defaultCategory = await prisma.categories.create({ data : { name : "Dafault Category"}});
              const defaultStudent = await prisma.students.create({ data : { contestantNumber : 1 , major : "default Major" , name : "default name" , year : 1 , zodiacId : 0 , categoryId : defaultCategory.id }});
              return res.status(200).json({ newAdmin , categories : [defaultCategory] , students : [ defaultStudent ] , votes : [] })
            }
          } else {
            return res.status(200).json({ err : "Admin limited quantity exceeded !" })
          }
        }
      } else {
        return res.status(200).json({ err : "Wrong Admin Code !"})
      }
    }
    
}
