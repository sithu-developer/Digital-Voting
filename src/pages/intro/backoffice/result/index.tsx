import { useAppSelector } from "@/store/hooks";
import { Box, Button, Chip, Divider, IconButton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { zodiacSigns } from "@/util/general";
import { ZodiacSignType } from "@/types/general";
import { StudentWithVotes, VoteListItems } from "@/types/student";
import VoteList from "@/components/VoteList";
import { Categories } from "../../../../../generated/prisma";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Permission from "@/components/Permission";

const ResultPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ selectedCategory , setSelectedCategory ] = useState<Categories>();
    const [ studentsWithVotes , setStudentsWithVotes ] = useState<StudentWithVotes[]>([]);
    const [ voteListItems , setVoteListItems ] = useState<VoteListItems>({ open : false , selectedStudentId : 0});
    const [ searchOpen , setSearchOpen ] = useState(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const [ permissionOpen , setPermissionOpen ] = useState<boolean>(false);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const students = useAppSelector(store => store.studentsSlice.students);
    const votes = useAppSelector(store => store.votesSlice.votes);


    useEffect(() => {
        if(categories.length && localStorage) {
            const selsectedCategoryId = Number(localStorage.getItem("selectedCategoryIdFromVotePage"));
            const selectedCategory = categories.find(item => item.id === selsectedCategoryId);
            if(selectedCategory) {
                setSelectedCategory(selectedCategory);
            } else {
                setSelectedCategory(categories[0]);
                localStorage.setItem("selectedCategoryIdFromVotePage" , String(categories[0].id))
            }
        }
    } , [categories])

    useEffect(() => {
        if(votes.length && students.length && selectedCategory) {
            const relatedStudents = students.filter(item => item.categoryId === selectedCategory.id);
            const studentsWithVotes = relatedStudents.map(student => {
                const relatedVotes = votes.filter(vote => vote.studentId === student.id);
                return { student , relatedVotes }
            }).sort((a,b) => b.relatedVotes.length - a.relatedVotes.length ).filter(item => item.student.name.toLowerCase().includes(searchValue.toLowerCase()));
            setStudentsWithVotes(studentsWithVotes);
        }
    } , [ votes , students , selectedCategory , searchValue ])

    if(admin) {
    return (
        <Box sx={{ display : "flex" , flexDirection : "column" , gap : "5px" , position : "relative"}} >
            <Box sx={{ display : "flex" , justifyContent : "start" , gap : "10px", overflow : "hidden" , overflowX : "auto" , py : "8px" , mx : "20px" }}>
                {selectedCategory && categories.map(item => (
                    <Chip  key={item.id} sx={{ bgcolor : (selectedCategory.id === item.id ? "info.dark" : "") , '&:hover' : { bgcolor : "info.dark"} , color : (selectedCategory.id === item.id ? "white" : "black") }} label={item.name} onClick={() => {
                        localStorage.setItem("selectedCategoryIdFromVotePage" , String(item.id))
                        setSelectedCategory(item);
                    }} />
                ))}
            </Box>
            <Box sx={{  px : "20px"}}>
                {searchOpen ? <Box sx={{ flexGrow : 1 , display : "flex" , justifyContent : "space-between" ,  alignItems : "center" }}>
                    <TextField sx={{ ml : "20px"}} autoFocus variant="standard" placeholder="Search..." onChange={(event) => setSearchValue(event.target.value)} />
                    <IconButton onClick={() => {
                        setSearchValue("");
                        setSearchOpen(false)
                    }} >
                        <CloseRoundedIcon sx={{ color : "black"}} />
                    </IconButton> 
                </Box>
                :<Box sx={{ flexGrow : 1 , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                    {selectedCategory && <Box sx={{ display : "flex" , alignItems : "center" , gap : "5px" ,  ml : "20px"}} >
                        <img src={selectedCategory.iconUrl} style={{ width : "35px" , maxHeight : "50px"}} />
                        <Typography variant="h5" >{selectedCategory.name} {selectedCategory.isShownResult ? "(Announced)" :""}</Typography>
                    </Box>}
                    <IconButton onClick={() => setSearchOpen(true)} >
                        <SearchRoundedIcon sx={{ color : "black"}} />
                    </IconButton>   
                </Box>}
            </Box>
            <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , height : "calc(100vh - 200px)", overflowY : "auto" , p : "10px" }}>
                {studentsWithVotes.map(item => {
                const currentZodiac = zodiacSigns.find(zodiac => zodiac.id === item.student.zodiacId) as ZodiacSignType;
                return (
                    <Box key={item.student.id} sx={{ display : "flex" , gap : "15px" , bgcolor : "info.main" , p : "10px" , borderRadius : "15px" , minWidth : "350px" , maxWidth : "500px"}} >
                        <Box sx={{ width : "90px" , height : "90px" , background : `radial-gradient(ellipse at center,#AAB6F8 5%,#8D9CF2 25%,#5B6DD7 55%,#3747A3 75%)` , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "start" , alignItems : "center" , position : "relative" , overflow : "hidden" }} >
                            <img alt="king photo" src={item.student.url} style={{ width : "100%"}} />
                            <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                                <img alt="number boundary" src={ item.student.url.includes("Default") ? "/numberBoundaryWithBg.svg" : "/numberBoundary.svg"}/>
                                <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{item.student.contestantNumber}</Typography>
                            </Box>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor : "white"}} />
                        <Box sx={{ position : "relative" , flexGrow : 1 , bgcolor : "rgba(255, 255, 255, 0.2)", borderRadius : "10px", backdropFilter : "blur(10px)", WebkitBackdropFilter: "blur(10px)" , p : "5px"}} >
                            <Typography sx={{ textAlign : "center"}}>{item.student.name}</Typography>
                            <Box sx={{ display : "flex" , mt : "5px" , height : "45px" ,px : "10px" , justifyContent : "space-between"}} >
                                <Box>
                                    <Typography sx={{  fontSize : "12px"}}>Year : {item.student.year}</Typography>
                                    <Typography sx={{ fontSize : "12px" , mt : "10px"}}>Major : {item.student.major}</Typography>
                                </Box>
                                <Typography sx={{ fontSize : "12px" }} >Zodiac : {currentZodiac.zodiac.replace(/\s*\(.*$/, '')}</Typography>
                            </Box>
                            <Box sx={{ clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)' , width : "58%" , p : "5px" , cursor : "pointer" , bgcolor : "info.main" , position : "absolute" , bottom : "-1px" , right : "-1px" , display : "flex" , justifyContent : "end" , alignItems : "center" , gap :  "5px"}} onClick={() => {
                                setVoteListItems({open : true , selectedStudentId : item.student.id })
                            }} >
                                <Typography sx={{ fontSize : "12px" }}>Total votes</Typography>
                                <Box sx={{ bgcolor : "#6D42B2" , minWidth : "30px" , px : "1px" , borderRadius : "3px"}}>
                                    <Typography  sx={{ fontSize : "12px" , color : "black" , textAlign : "center" }}>{item.relatedVotes.length}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )})}
            </Box>
            <Permission permissionOpen={permissionOpen} setPermissionOpen={setPermissionOpen} selectedCategory={selectedCategory}  />
            <VoteList voteListItems={voteListItems} setVoteListItems={setVoteListItems} />
            <Button onClick={() => setPermissionOpen(true)} sx={{ position : "absolute" , bgcolor : "#6D42B2" , bottom : "5px" , left : "50%" , transform: "translateX(-50%)" , border : "1px solid white" , textTransform : "none"}} variant="contained" >Show {selectedCategory?.name} Result</Button>
        </Box>
    )}
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default ResultPage;