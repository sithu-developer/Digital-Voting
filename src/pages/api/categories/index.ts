import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewCategoryItems, UpdatedCategoryItems } from "@/types/categories";
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
        const { newCategory , iconUrl } = req.body as NewCategoryItems;
        const isValid = newCategory && iconUrl;
        if(!isValid) return res.status(400).send("Bad request");
        const category = await prisma.categories.create({ data : { name : newCategory , iconUrl }});
        return res.status(200).json({ category });
    } else if(method === "PUT") {
        const { id , name , iconUrl , isShownResult } = req.body as UpdatedCategoryItems;
        const isValid = id && name && iconUrl && isShownResult !== undefined;
        if(!isValid) return res.status(400).send("Bad request");
        const isExit = await prisma.categories.findUnique({ where : { id }});
        if(!isExit) return res.status(400).send("Bad request");
        const category = await prisma.categories.update({ where :{ id } , data : { name , iconUrl , isShownResult }});
        return res.status(200).json({ category })
    } else if(method === "DELETE") {
        const categoryId = Number(req.query.categoryId);
        if(!categoryId) return res.status(400).send("Bad request");
        const isExit = await prisma.categories.findUnique({ where : { id : categoryId }});
        if(!isExit) return res.status(400).send("Bad request");
        const deletedStudentIds = (await prisma.students.findMany({ where : { categoryId }})).map(item => item.id);
        const deletedVotes = await prisma.votes.findMany({ where : { studentId : { in : deletedStudentIds }}})
        await prisma.votes.deleteMany({ where : { studentId : { in : deletedStudentIds }}})
        await prisma.students.deleteMany({ where : { categoryId }});
        await prisma.categories.delete({ where : { id : categoryId }});
        return res.status(200).json({ deletedCategoryId : categoryId , deletedVotes })
    } else if(method === "GET") {
        const majorOfAdmin = await prisma.major.findUnique({ where : { majorsOrAdmin : "admin" }}) as Major;
        const categories = await prisma.categories.findMany({ orderBy : { id : "asc" }});
        const votes = await prisma.votes.findMany({ orderBy : { id : "asc" }});
        return res.status(200).json({ categories , votes , isTimeUp : majorOfAdmin.isTimeUp });
    }   
}
