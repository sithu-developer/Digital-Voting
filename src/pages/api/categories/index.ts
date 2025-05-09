import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { DeletedCategoryItems, NewCategoryItems, UpdatedCategoryItems } from "@/types/categories";
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
    } else if(method === "PUT") {
        const { updatedCategory } = req.body as UpdatedCategoryItems;
        if(!updatedCategory) return res.status(400).send("Bad request");
        const isExit = await prisma.categories.findUnique({ where : { id : updatedCategory.id }});
        if(!isExit) return res.status(400).send("Bad request");
        const category = await prisma.categories.update({ where :{ id : updatedCategory.id} , data : { name : updatedCategory.name}});
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
    }
}
