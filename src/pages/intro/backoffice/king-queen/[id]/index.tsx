import { useAppSelector } from "@/store/hooks";
import { Box, Typography } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Students } from "../../../../../../generated/prisma";

const EditStudentPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ updatedStudent , setUpdatedStudent ] = useState<Students>();
    const router = useRouter();
    const id = Number(router.query.id);
    const students = useAppSelector(store => store.studentsSlice.students);

    useEffect(() => {
        if(students.length && id) {
            const currentStudent = students.find(item => item.id === id);
            setUpdatedStudent(currentStudent)
        }

    } , [students , id ])
    
    if(admin && updatedStudent) 
    return (
        <Box sx={{ p : "10px"}}>{updatedStudent.name}</Box> // here
    )
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default EditStudentPage;