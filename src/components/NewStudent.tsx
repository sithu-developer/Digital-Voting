import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { createNewStudent } from "@/store/slices/studentsSlice";
import { Severity } from "@/types/snackBar";
import { NewStudentItems } from "@/types/student";
import { zodiacSigns } from "@/util/general";
import { Box, Button, Chip, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Categories } from "../../generated/prisma";
import { uploadPhoto } from "@/util/uploadPhoto";
import { PutBlobResult } from "@vercel/blob";

interface Props {
    selectedCategory : Categories,
    newStudentOpen : boolean,
    setNewStudentOpen : ( value : boolean ) => void;
}

const defaultNewStudent : NewStudentItems = {
    name : "" , major : "" , year : 0 , zodiacId : 0 , contestantNumber : 0 , url : "" , categoryId : 0
}

const NewStudent = ({ selectedCategory , newStudentOpen , setNewStudentOpen } : Props) => {
    const [ newStudent , setNewStudent ] = useState<NewStudentItems>(defaultNewStudent);
    const [ photoFile , setPhotoFile ] = useState<File>();
    const students = useAppSelector(store => store.studentsSlice.students);
    const relatedStudent = students.filter(item => item.categoryId === selectedCategory.id);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(selectedCategory) {
            setNewStudent(prev => ({...prev , categoryId : selectedCategory.id }))
        }
    } , [selectedCategory])

    const handleCreateNewStudent = async() => {
        const exitContestantNumbers = relatedStudent.map(item => item.contestantNumber);
        if(!exitContestantNumbers.includes(newStudent.contestantNumber) ) {
            if(photoFile) {
                dispatch(changeIsLoading(true));
                const blob = await uploadPhoto(photoFile) as PutBlobResult;
                dispatch(createNewStudent({...newStudent , url : blob.url , isSuccess : () => {
                    setNewStudentOpen(false);
                    setPhotoFile(undefined);
                    setNewStudent({...defaultNewStudent , categoryId : selectedCategory.id  , url : `/${selectedCategory.name.toLowerCase().trim()}Default.jpg` });
                    dispatch(changeIsLoading(false));
                    dispatch(openSnackBar({ open : true , message : "Successfully created a student" , severity : Severity.success}))
                }}))
            }
        } else {
            dispatch(openSnackBar({ open : true , message : `Contestant Number already exit in ${selectedCategory.name} !` , severity : Severity.warning}))
        }
    }
    return (
        <Dialog open={newStudentOpen} onClose={() => {
            setNewStudentOpen(false);
            setPhotoFile(undefined);
            setNewStudent({...defaultNewStudent , categoryId : selectedCategory.id , url : `/${selectedCategory.name.toLowerCase().trim()}Default.jpg`});
        }} >
            <DialogContent sx={{ bgcolor : "secondary.main" , display : "flex" , flexDirection : "column" , gap : "20px" }}>
                <Typography variant="h5" color="info" >New {selectedCategory.name}</Typography>
                <Box sx={{ display : "flex" , flexDirection : "column" , gap : "10px"}} >
                    <TextField autoFocus label="Contestant number" type="number"  onChange={(event) => setNewStudent({...newStudent , contestantNumber : Number(event.target.value)})} />
                    <TextField label="Name" onChange={(event) => setNewStudent({...newStudent , name : event.target.value})} />
                    <TextField label="Year" type="number" onChange={(event) => setNewStudent({...newStudent , year : Number(event.target.value)})} />
                    <TextField label="Major" onChange={(event) => setNewStudent({...newStudent , major : event.target.value})} />
                    <FormControl fullWidth>
                        <InputLabel id="zodiac">Zodiac sign</InputLabel>
                        <Select
                          labelId="zodiac"
                          id="zodiac-sign"
                          value={newStudent.zodiacId}
                          label="Zodiac sign"
                          onChange={(event) => setNewStudent({...newStudent , zodiacId : event.target.value})}
                          sx={{ '& .MuiMenuItem-root': { backgroundColor : "secondary.main" }}}
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
                      Choose Photo
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
                <Box sx={{ display : "flex" , justifyContent : "end" , gap : "10px"}} >
                    <Button variant="contained" onClick={() => {
                        setNewStudentOpen(false);
                        setPhotoFile(undefined);
                        setNewStudent({...defaultNewStudent , categoryId : selectedCategory.id , url : `/${selectedCategory.name.toLowerCase().trim()}Default.jpg` });
                    }} >cancel</Button>
                    <Button variant="contained" disabled={!newStudent.contestantNumber || !newStudent.name || !newStudent.year || !newStudent.major || !photoFile} onClick={handleCreateNewStudent} >Create</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default NewStudent;