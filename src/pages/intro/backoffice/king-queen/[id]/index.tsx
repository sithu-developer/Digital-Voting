import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { zodiacSigns } from "@/util/general";
import { updateStudent } from "@/store/slices/studentsSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import DeleteComfirmation from "@/components/DeleteComfirmation";
import { Students } from "../../../../../../generated/prisma";
import Image from "next/image";
import { uploadPhoto } from "@/util/uploadPhoto";
import { PutBlobResult } from "@vercel/blob";

const EditStudentPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ updatedStudent , setUpdatedStudent ] = useState<Students>();
    const [ photoFile , setPhotoFile ] = useState<File>();
    const [ deleteOpen , setDeleteOpen ] = useState<boolean>(false);
    const router = useRouter();
    const id = Number(router.query.id);
    const students = useAppSelector(store => store.studentsSlice.students);
    const relatedStudent = students.filter(item => item.categoryId === updatedStudent?.categoryId).filter(item => item.id !== id);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(students.length && id) {
            const currentStudent = students.find(item => item.id === id);
            setUpdatedStudent(currentStudent);
        }

    } , [students , id ])


    
    if(admin && updatedStudent) {


    const handleUpdateStudent = async() => {
        const exitContestantNumbers = relatedStudent.map(item => item.contestantNumber);
        if(!exitContestantNumbers.includes(updatedStudent.contestantNumber) ) {
            dispatch(changeIsLoading(true));
            if(photoFile) {
                const blob = await uploadPhoto(photoFile) as PutBlobResult;
                dispatch(updateStudent({...updatedStudent , url : blob.url , isSuccess : () => {
                    dispatch(changeIsLoading(false));
                    dispatch(openSnackBar({ open : true , message : "Successfully updated" , severity : Severity.success}))
                }}))
            } else {
                dispatch(updateStudent({...updatedStudent , isSuccess : () => {
                    dispatch(changeIsLoading(false));
                    dispatch(openSnackBar({ open : true , message : "Successfully updated" , severity : Severity.success}))
                }}))
            }
        } else {
            dispatch(openSnackBar({ open : true , message : `Contestant Number already exit !` , severity : Severity.warning}))
        }
    }


    return (
        <Box sx={{ p : "10px" , display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "15px" }}>
            <Box sx={{ width : "100%" , display : "flex" , justifyContent : "end"}} >
                <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)} >Delete</Button> 
            </Box>
            <Box sx={{ width : "150px" , borderRadius : "10px" , overflow : "hidden" , bgcolor : `#28316B` , display : "flex" , flexDirection : "column" , justifyContent : "end" , alignItems : "center"}} >
                <Image alt="profile" src={updatedStudent.url} width={1000} height={1000} style={{ width : "150px" , height : "auto"}}  />
            </Box>
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "10px" , width : "100%"}}>
                <TextField label="Contestant number" type="number" defaultValue={updatedStudent.contestantNumber} onChange={(event) => setUpdatedStudent({...updatedStudent , contestantNumber : Number(event.target.value)})} />
                <TextField label="Name" defaultValue={updatedStudent.name} onChange={(event) => setUpdatedStudent({...updatedStudent , name : event.target.value})} />
                <TextField label="Year" defaultValue={updatedStudent.year} type="number" onChange={(event) => setUpdatedStudent({...updatedStudent , year : Number(event.target.value)})} />
                <TextField label="Major" defaultValue={updatedStudent.major} onChange={(event) => setUpdatedStudent({...updatedStudent , major : event.target.value})} />
                <FormControl>
                    <InputLabel id="zodiac">Zodiac sign</InputLabel>
                    <Select
                      labelId="zodiac"
                      id="zodiac-sign"
                      value={updatedStudent.zodiacId}
                      label="Zodiac sign"
                      onChange={(event) => setUpdatedStudent({...updatedStudent , zodiacId : event.target.value})}
                      MenuProps={{
                        PaperProps: {
                            sx: {
                              backgroundColor: 'secondary.light',
                            },
                        },
                      }}
                    >
                        {zodiacSigns.map(item => (
                            <MenuItem key={item.id} value={item.id} sx={{ color : "black"}} >{item.zodiac}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                  color="info"
                  variant="outlined"
                  component="label"
                  sx={{ height : "53px"}}
                >
                  Choose Photo ( optional )
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        const files = event.target.files;
                        if(files) {
                           setPhotoFile(files[0]);
                        }
                        event.target.value = "";
                    }}
                  />
                </Button>
                <Box>
                    {photoFile && <Chip label={photoFile.name} variant="outlined" onDelete={() => setPhotoFile(undefined)} />}
                </Box>
            </Box>
            <Box sx={{ display : "flex" , width : "100%" , gap : "10px"}} >
                <Button variant="contained" onClick={() => router.push("/intro/backoffice/king-queen")} >Cancel</Button>
                <Button variant="contained" disabled={!updatedStudent.contestantNumber || !updatedStudent.name || !updatedStudent.year || !updatedStudent.major} onClick={handleUpdateStudent} >Update</Button>
            </Box>
            <DeleteComfirmation deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} studentToDelete={updatedStudent} />
        </Box>
    )}
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro/sign-up"} >Click here</Link></Typography>
        </Box>
    )
}

export default EditStudentPage;