import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BottomNavigation, BottomNavigationAction, Box, Button, IconButton, Typography } from "@mui/material"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Categories, Students, Votes } from "../../../../../generated/prisma";
import { zodiacSigns } from "@/util/general";
import { ZodiacSignType } from "@/types/general";
import { revoteStudent, voteStudent } from "@/store/slices/votesSlice";
import { openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { useRouter } from "next/router";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { checkIsTimeUp } from "@/store/slices/userSlice";

const KingSelectionPage = () => {
    const user = useAppSelector(store => store.userSlice.user);
    const isTimeUp = useAppSelector(store => store.userSlice.isTimeUp);
    const [ selectedCategory , setSelectedCategory ] = useState<Categories>();
    const [ numberForBackground  , setNumberForBackground ] = useState<number>(1);
    const [ votedStudent , setVotedStudent ] = useState<Students>();
    const [ alreadyVotedStudent , setAlreadyVotedStudent ] = useState<Students>();
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const students = useAppSelector(store => store.studentsSlice.students);
    const relatedStudents = students.filter(item => item.categoryId === selectedCategory?.id);
    const sortedStudents = relatedStudents.sort((a,b) => a.contestantNumber - b.contestantNumber );
    const votes = useAppSelector(store => store.votesSlice.votes);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const categoryId = Number(router.query.categoryId);

    useEffect(() => {
        if(categories.length && localStorage && !categoryId) {
            const selsectedCategoryId = Number(localStorage.getItem("selectedCategoryIdFromVoting"));
            const selectedCategory = categories.find(item => item.id === selsectedCategoryId);
            if(selectedCategory) {
                setSelectedCategory(selectedCategory);
            } else {
                setSelectedCategory(categories[0]);
                localStorage.setItem("selectedCategoryIdFromVoting" , String(categories[0].id))
            }
        } else if(categories.length && localStorage && categoryId) {
            const selectedCategory = categories.find(item => item.id === categoryId) as Categories;
            setSelectedCategory(selectedCategory);
            localStorage.setItem("selectedCategoryIdFromVoting" , String(selectedCategory.id))
        }
    } , [categories])

    useEffect(() => {
        if(selectedCategory) {
            const ceilIndexOfSelectedCategory = Math.ceil((categories.indexOf(selectedCategory) + 1)/2);
            setNumberForBackground(ceilIndexOfSelectedCategory % 2);
        } else {
            setNumberForBackground(1);
        }
    } , [selectedCategory])

    useEffect(() => {
        if(selectedCategory && votes.length && students.length) {
            const relatedStudents = students.filter(item => item.categoryId === selectedCategory.id);
            const alreadyVotedStudentIds = votes.map(item => item.studentId);
            const alreadyVotedStudent = relatedStudents.find(item => alreadyVotedStudentIds.includes(item.id));
            setVotedStudent(alreadyVotedStudent);
            setAlreadyVotedStudent(alreadyVotedStudent);
        } else {
            setVotedStudent(undefined)
        }
    } , [selectedCategory , votes , students])

    useEffect(() => {
        if(categories.length && votes.length && categories.length === votes.length && !categoryId) {
            router.push("/intro/voting/thank-for-voting");
        }
    } , [categories , votes , categoryId ]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(checkIsTimeUp());
        } , 6000);
        return () => {
            clearInterval(interval);
        }
    } , [])

    useEffect(() => {
        if(isTimeUp) {
            router.push("/intro/voting/results");
        }
    } , [ isTimeUp ])

    
    if(user) {

    const handleVoteStudent = () => {
        if(votedStudent) {
            dispatch(voteStudent({ studentId : votedStudent.id , userId : user.id , isSuccess : () => {
                dispatch(openSnackBar({ open : true , message : "Successfully voted" , severity : Severity.success }))
            } }))
        }
    }

    const handleRevoteStudent = () => {
        if(votedStudent && alreadyVotedStudent) {
            const alreadyExitVote = votes.find(item => (item.studentId === alreadyVotedStudent.id)) as Votes;
           dispatch(revoteStudent({ id : alreadyExitVote.id , studentId : votedStudent.id , isSuccess : () => {
                categoryId && router.push("/intro/voting/thank-for-voting");
                dispatch(openSnackBar({ open : true , message : "Successfully revoted" , severity : Severity.success}))
           } }));
        }
    }
    
    return (
        <Box sx={{ position : "relative" , width : "100vw" , height : "100vh" , bgcolor : numberForBackground ?  "#031020" : "#091D7D" , overflow : "hidden" , display : "flex" , flexDirection : "column" , alignItems : "center"  }}  >
            {numberForBackground ? <img src={"/selectionBackground.jpg"} style={{ height : "100vh"  , opacity : "60%" }} />
            : <img src={"/selectionBackground2.jpg"} style={{ height : "calc(100vh - 34px)" , width : "120vw" , opacity : "50%" }} />}
            <Box sx={{ position : "absolute" , top : "80px" , width : "100%" , display : "flex" , flexDirection : "column" , alignItems : "center" }} >
                {selectedCategory && <img src={selectedCategory.iconUrl} style={{ width : "18%" , position : "absolute" , top : "-55px" }} />}
                <Box sx={{ display : "flex" , width : "75%" , position : "relative" }}>
                    <Box sx={{ width: "35%", height: "12px", borderTop: "1px solid #BFCDEC"}} />
                    <Box sx={{ width: "30%", height: "12px", borderBottom : "1px solid #BFCDEC" , borderLeft : "1px solid #BFCDEC" , borderRight : "1px solid #BFCDEC" }} />
                    <Box sx={{ width: "35%", height: "12px", borderTop: "1px solid #BFCDEC" }} >
                        <img src={"/butterfly.gif"} style={{ position : "absolute" , top : "-38px" , right : "-40px" ,  width : "70px" , transform : "rotate(48deg)" }} />
                    </Box>
                </Box>
                <Typography sx={{ width : "100vw" , fontSize : "38px" , fontFamily : "Microsoft YaHei UI" , textAlign : "center" , color : "#DAE9FE" }} >{selectedCategory?.name.toUpperCase()} SELECTION</Typography>
                <Box sx={{ display : "flex" , alignItems : "center"  , width : "75%"}}>
                    <Box sx={{ width: "35%", borderTop: "1px solid #BFCDEC"}} />
                    <Typography sx={{ width : "30%" , fontFamily : "Monotype Corsiva" , textAlign : "center" , lineHeight : 1 , color : "#BFCDEC"}} >LET'SVOTE</Typography>
                    <Box sx={{ width: "35%", borderTop: "1px solid #BFCDEC" }} />
                </Box>
            </Box>
            <Box sx={{ position : "absolute" , top : "185px" , borderRadius : "10px" , width : "95%" , display : "grid" , gridTemplateColumns : "repeat(auto-fill, minmax(100px, 1fr))" , gap : 1 , overflowY : "auto", height : "calc(100vh - 350px)" }}>
                {sortedStudents.map(item => {
                const currentZodiac = zodiacSigns.find(zodiac => zodiac.id === item.zodiacId) as ZodiacSignType;
                return (
                    <Box key={item.id} sx={{ border : (votedStudent?.id === item.id ?  "3px solid #FFD700" : "") , width : "115px" , height : "140px" , background : `radial-gradient(ellipse at center,#AAB6F8 5%,#8D9CF2 25%,#5B6DD7 55%,#3747A3 75%)` , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "start" , alignItems : "center" , position : "relative" , overflow : "hidden" , cursor : "pointer" }}
                        onClick={() => setVotedStudent(item)}
                    >
                        <img alt="king photo" src={item.url} style={{ width : "100%"}} />
                        <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                            <img alt="number boundary" src={ item.url.includes("Default") ? "/numberBoundaryWithBg.svg" : "/numberBoundary.svg"}/>
                            <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{item.contestantNumber}</Typography>
                        </Box>
                        <Box sx={{ position : "absolute" , bottom : "0px" , bgcolor : "info.main" , width : "100%" , display : "flex"  , flexDirection : "column" , justifyContent : "center" , alignItems : "center" , gap : "3px" , p : "5px" , borderRadius : "15px" }} >
                            <Typography sx={{ fontSize : "12px" , lineHeight : 1 , textAlign : "center" }} >{item.name} {currentZodiac.zodiac.replace(/^.*?-|\s*\(.*?\)/g, '')}</Typography>
                            <Typography sx={{ fontSize : "12px" , lineHeight : 1}}>{ item.year  + " " + item.major }</Typography>
                        </Box>
                    </Box>
                )})}
            </Box>
            <Box sx={{ display : "flex" , alignItems : "center" , justifyContent : "center" , gap : categoryId ? "20px" : "40px" , width : "80%" , position : "absolute" , bottom : "85px" , height : "65px"}}>
                {(categories[0]?.id === selectedCategory?.id) && <img src={"/kingButtonSide.svg"} />}
                {(categories[1]?.id === selectedCategory?.id) && <img src={"/queenButtonSide.svg"} />}
                <Box sx={{ display : "flex" , alignItems : "center" , ml : "5px" }}>
                    {categoryId ? <IconButton onClick={() => router.push("/intro/voting/thank-for-voting") } >
                        <ClearRoundedIcon sx={{ color : "white" , fontSize : "30px" , bgcolor : "#7485E5" , borderRadius : "10px" }} />
                    </IconButton> : undefined}
                    {(alreadyVotedStudent !== votedStudent && alreadyVotedStudent !== undefined && votedStudent !== undefined) ? <Button variant="contained" sx={{ bgcolor : "#7485E5" , py : "0px" , borderRadius : "20px" , fontSize : "18px" , gap : "5px" }} 
                    onClick={handleRevoteStudent}
                    >Revote<img src={"/voteChecked.svg"} style={{ width : "19px"}} /></Button>
                    :<Button disabled={!votedStudent || (alreadyVotedStudent === votedStudent)} variant="contained" sx={{ bgcolor : "#7485E5" , py : "0px" , borderRadius : "20px" , fontSize : "18px" , gap : "5px" , '&.Mui-disabled' : { color : "GrayText" , bgcolor : "rgb(28, 32, 77)"} }} 
                        onClick={handleVoteStudent}
                    > {(alreadyVotedStudent === votedStudent && votedStudent !== undefined) ? "Voted" : "Vote"} <img src={"/voteChecked.svg"} style={{ width : "19px"}} /></Button>}
                </Box>
                {(categories[0]?.id === selectedCategory?.id) && <img src={"/kingButtonSide.svg"} />}
                {(categories[1]?.id === selectedCategory?.id) && <img src={"/queenButtonSide.svg"} />}
            </Box>
            
            <BottomNavigation
              value={selectedCategory ? selectedCategory.id : categories[0]?.id }
              sx={{  position : "absolute" , bottom : "0px" , bgcolor : "info.dark" , overflowX : "auto" , width : "100%" , display : "flex" , justifyContent : "start" , height : "65px" , borderTopLeftRadius : "20px" , borderTopRightRadius : "20px"}}
            >
                {categories.map(item => (
                    <BottomNavigationAction key={item.id} onClick={() => {
                        setSelectedCategory(item);
                        localStorage.setItem("selectedCategoryIdFromVoting" , String(item.id))
                    }} value={item.id} sx={{ color : "white" , '&.Mui-selected' : { color : "white"} }} label={item.name} icon={<img src={item.iconUrl}  style={{ width : "32px"}} />} />
                ))}
            </BottomNavigation>
        </Box>
    )}
    else 
    return (
        <Box>
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default KingSelectionPage;

//  sx={{ position : "absolute" , bottom : "85px" , right : "30px"}}