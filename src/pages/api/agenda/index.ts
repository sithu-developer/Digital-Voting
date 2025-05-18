import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/util/prisma";
import { NewAgendaItems, UpdatedAgendaItems } from "@/types/agenda";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("unauthorized");
    const method = req.method;
    if(method === "POST") {
        const { agendaUrl } = req.body as NewAgendaItems;
        if(!agendaUrl) return res.status(400).send("Bad request");
        const newAgenda = await prisma.agenda.create({ data : { agendaUrl }});
        return res.status(200).json({ newAgenda })
    }else if( method === "PUT" ) {
        const { id , agendaUrl } = req.body as UpdatedAgendaItems;
        const isValid = id && agendaUrl;
        if(!isValid) return res.status(400).send("Bad request");
        const exit = await prisma.agenda.findUnique({ where : { id }});
        if(!exit) return res.status(400).send("Bad request");
        const updatedAgenda = await prisma.agenda.update({ where : { id } , data : { agendaUrl }});
        return res.status(200).json({ updatedAgenda })
    } else if(method === "DELETE") {
        const id = Number(req.query.id);
        if(!id) return res.status(400).send("Bad request");
        const exit = await prisma.agenda.findUnique({ where : { id }});
        if(!exit) return res.status(400).send("Bad request");
        await prisma.agenda.delete({ where : { id }});
        return res.status(200).json({ deletedAgendaId : id  });
    }
}
