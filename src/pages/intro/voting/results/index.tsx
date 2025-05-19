import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkFromResultPage } from "@/store/slices/categoriesSlice";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VotingResultPage = () => {
    const isTimeUp = useAppSelector(store => store.userSlice.isTimeUp);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const votes = useAppSelector(store => store.votesSlice.votes);
    const students = useAppSelector(store => store.studentsSlice.students);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if(!isTimeUp) {
            const interval = setTimeout(() => {
                router.push("/intro/voting/selections");
            } , 15000);
            return () => {
                clearTimeout(interval);
            }
        }
    } , [isTimeUp]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(checkFromResultPage())
        } , 5000);
        return () => {
            clearInterval(interval);
        }
    } , [])


    
    if(isTimeUp) { 
    return (
        <Box sx={{ position : "relative" , bgcolor : "#01005D" , height : "100vh" , display : "flex" , flexDirection : "column" , alignItems : "center"}}>
            <img alt="voting result background" src={"/votingResultBg.png"} style={{ height : "100%" , width : "100%"}}/>
            <Box sx={{ position : "absolute" , top : "35px" , display : "flex" , flexDirection : "column" , alignItems : "center"}}>
                <img alt="voting result crown" src={"/votingResultCrown.png"} style={{ width : "80px" }} />
                <Typography variant="h4" sx={{ fontFamily : "Inria Serif" , fontStyle : "italic" , textAlign : "center" , WebkitTextStroke: '1.5px #EAAA45', textStroke: '1.5px #EAAA45'}} >VOTING RESULTS</Typography>
            </Box>
            <Box sx={{ position : "absolute" , top : "155px" , height : "calc(100vh - 210px)" , width : "80%" , display : "flex" , gap : "20px" , flexWrap : "wrap"}}>
                {(categories.length && students.length && votes.length) ? categories.map(item => {
                    const relatedStudents = students.filter(stu => stu.categoryId === item.id);
                    const studentsWithVoteNumber = relatedStudents.map(student => {
                        const relatedVotes = votes.filter(vote => vote.studentId === student.id);
                        return { student , relatedVoteNumber : relatedVotes.length }
                    }).sort((a,b) => b.relatedVoteNumber - a.relatedVoteNumber );
                    const winner = studentsWithVoteNumber[0];
                    return (
                        <Box key={item.id} >
                            <Box sx={{ position : "relative"}} >
                                <Box sx={{ position: "absolute" , top : "0px" , width : "100px" , height : "130px" , borderRadius: '50%' , p : "4px" , background: 'linear-gradient(90deg, #CD9C56 5%, #DECCB3 32%, #BD8F4F 66%, #AA8146 84%, #CBDBA5 100%)' , WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' }} ></Box>
                                <Box sx={{ width : "100px" , height : "130px" , borderRadius: '50%' ,display : "flex" , flexDirection : "column" , justifyContent : "center" , overflow : "hidden"}} >
                                    <img alt="winner photo" src={winner.student.url} style={{ width : "100px"}} />
                                </Box>
                            </Box>
                            <Typography sx={{ fontFamily : "Average" , color : "#B4884B" , fontSize : "31px" }} >{item.name.toUpperCase()}</Typography>
                        </Box>
                    )
                })
                :undefined}
            </Box>
        </Box>
    )}
    else 
    return (
        <Box>
            <Typography variant="h5" sx={{ textAlign : "center"}} > Go to the selection page <Link href={"/intro/voting/selections"} >Click here</Link></Typography>
        </Box>
    )
}

export default VotingResultPage;