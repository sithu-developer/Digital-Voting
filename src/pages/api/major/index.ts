import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { NewMajorItems, UpdatedMajorItems } from "@/types/major";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "PUT") {
        const { id , majorsOrAdmin , maxQuantity , passCode , isTimeUp } = req.body as UpdatedMajorItems;
        const isValid = id && majorsOrAdmin && maxQuantity && passCode && isTimeUp !== undefined ;
        if(!isValid) return res.status(400).send("Bad request");
        if(majorsOrAdmin === "admin") {
            const updatedAdminInMajor = await prisma.major.update({ where : { id } , data : { maxQuantity , passCode , isTimeUp }});
            return res.status(200).json({ updatedAdminInMajor });
        } else {
            const updatedMajor = await prisma.major.update({ where : { id } , data : { majorsOrAdmin , maxQuantity , passCode }});
            return res.status(200).json({ updatedMajor });
        }
    } else if(method === "POST") {
        const { majorName , majorCode , quantity } = req.body as NewMajorItems;
        const isValid = majorName && majorCode && quantity;
        if(!isValid || majorName === "admin") return res.status(400).send("Bad request");
        const newMajor = await prisma.major.create({ data : { majorsOrAdmin : majorName , passCode : majorCode , maxQuantity : quantity }});
        return res.status(200).json({ newMajor })
    } else if(method === "DELETE") {
        const majorId = Number(req.query.majorId);
        if(!majorId) return res.status(400).send("Bad request");
        const isExit = await prisma.major.findUnique({ where : { id : majorId }});
        if(!isExit) return res.status(400).send("Bad request");
        const deletedUserIds = (await prisma.user.findMany({ where : { majorId }})).map(item => item.id);
        const deletedVotes = await prisma.votes.findMany({ where : { userId : { in : deletedUserIds }}});
        await prisma.votes.deleteMany({ where : { userId : { in : deletedUserIds } }});
        await prisma.user.deleteMany({  where : { majorId } });
        await prisma.major.delete({ where : { id : majorId }})
        return res.status(200).json({ deletedMajorId : majorId , deletedVotes })
    }
}
