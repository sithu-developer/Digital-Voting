import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewAdminType } from "@/types/admin";
import { prisma } from "@/util/prisma";

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
      const adminInMajor = await prisma.major.findUnique({ where : { majorsOrAdmin : "admin" }});
      if(adminInMajor) {
        const exitedAdmins = await prisma.admin.findMany({ where : { adminMajorId : adminInMajor.id }});
        if(adminInMajor.passCode === password) {
          const categories = await prisma.categories.findMany({ orderBy : { id : 'asc'}});
          const students = await prisma.students.findMany({ orderBy : { id : 'asc'}});
          const votes = await prisma.votes.findMany({ orderBy : { id : 'asc'}});
          const users = await prisma.user.findMany({ orderBy : { id : "asc" } });
          const majors = await prisma.major.findMany({ orderBy : { id : "asc"}});
          const agendas = await prisma.agenda.findMany({ orderBy : { id : "asc" }})
          const exit = await prisma.admin.findUnique({ where : { email }})
          if(exit) {
            return res.status(200).json({ newAdmin : exit  , categories , students , votes , users , majors , agendas })
          } else {
            if( exitedAdmins.length < adminInMajor.maxQuantity ) {
              const newAdmin = await prisma.admin.create({ data : { email , adminMajorId : adminInMajor.id }})
              if(categories.length) {
                return res.status(200).json({ newAdmin , categories , students , votes , users , majors , agendas })
              } else {
                const defaultCategory = await prisma.categories.create({ data : { name : "Dafault Category" , iconUrl : "/kingCrownLogo.png"}});
                const defaultStudent = await prisma.students.create({ data : { contestantNumber : 1 , major : "default Major" , name : "default name" , year : 1 , zodiacId : 0 , categoryId : defaultCategory.id , url : "/secretMale.png" }});
                return res.status(200).json({ newAdmin , categories : [defaultCategory] , students : [ defaultStudent ] , votes : [] , users : [] , majors : [] , agendas : [] })
              }
            } else {
              return res.status(200).json({ err : "Admin limited quantity exceeded !" })
            }
          }
        } else {
          return res.status(200).json({ err : "Wrong Admin Code !"})
        }
      } else {
        await prisma.major.create({ data : { majorsOrAdmin : "admin" , passCode : "cheeHtoke" , maxQuantity : 5 }});
        return res.status(200).json({ err : "Please, login again !"})
      }
    } else if( method === "GET" ) {
      const users = await prisma.user.findMany({ orderBy : { id : "asc" } });
      const votes = await prisma.votes.findMany({ orderBy : { id : 'asc'}});
      return res.status(200).json({ users , votes })
    }
    
}
