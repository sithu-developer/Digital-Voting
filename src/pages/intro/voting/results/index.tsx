import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkFromResultPage } from "@/store/slices/categoriesSlice";
import { filterRelatedVotes } from "@/store/slices/votesSlice";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const VotingResultPage = () => {
    const user = useAppSelector(store  => store.userSlice.user);
    const isTimeUp = useAppSelector(store => store.userSlice.isTimeUp);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const votes = useAppSelector(store => store.votesSlice.votes);
    const students = useAppSelector(store => store.studentsSlice.students);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if(!isTimeUp && user && dispatch && router) {
            const interval = setTimeout(() => {
                dispatch(filterRelatedVotes(user.id))
                router.push("/intro/voting/selections");
            } , 5000);
            return () => {
                clearTimeout(interval);
            }
        }
    } , [isTimeUp , user , dispatch , router]);

    useEffect(() => {
        if(dispatch) {
            const interval = setInterval(() => {
                dispatch(checkFromResultPage())
            } , 5000);
            if(!isTimeUp) {
                clearInterval(interval);
            }
            return () => {
                clearInterval(interval);
            }
        }
    } , [dispatch , isTimeUp])


    
    if(isTimeUp) { 
    return (
        <Box sx={{ position : "relative" , bgcolor : "#01005D" , height : "100vh" , display : "flex" , flexDirection : "column" , alignItems : "center"}}>
            <Image alt="voting result background" src={"/votingResultBg.png"} width={1000} height={1000} style={{ height : "100%" , width : "100%"}}/>
            <Image alt="result celebrate gold filter" src={"/resultCelebrate.gif"} width={1000} height={1000} style={{ position : "absolute" , top : "0px" , width : "100%" , height : "100%"}} />
            <Box sx={{ position : "absolute" , top : "35px" , display : "flex" , flexDirection : "column" , alignItems : "center"}}>
                <Image alt="voting result crown" src={"/votingResultCrown.png"} width={200} height={200} style={{ width : "80px" , height : "auto" }} />
                <Typography variant="h4" sx={{ fontFamily : "'Times New Roman', Times, serif" , fontStyle : "italic" , textAlign : "center" , WebkitTextStroke: '1.5px #EAAA45', textStroke: '1.5px #EAAA45'}} >VOTING RESULTS</Typography>
            </Box>
            <Box sx={{ position : "absolute" , top : "155px" , height : "calc(100vh - 200px)" , width : "90%" , display : "flex" , flexDirection : "column", p : "10px" , overflowY : "auto" }}>
                {(categories.length && students.length && votes.length) ? categories.map(item => {
                    const relatedStudents = students.filter(stu => stu.categoryId === item.id);
                    const studentsWithVoteNumber = relatedStudents.map(student => {
                        const relatedVotes = votes.filter(vote => vote.studentId === student.id);
                        return { student , relatedVoteNumber : relatedVotes.length }
                    }).sort((a,b) => b.relatedVoteNumber - a.relatedVoteNumber );
                    const winner = studentsWithVoteNumber[0];
                    return (
                        <Box key={item.id} sx={{ display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : !(categories.indexOf(item) % 2 ) ? "start" : "end"  , height : "155px" , px : "14%" }} >
                            <Box>
                                <Box sx={{ position : "relative"}} >
                                    <Box sx={{ position: "absolute" , top : "0px" , width : "100px" , height : "130px" , borderRadius: '50%' , p : "4px" , background: 'linear-gradient(90deg, #CD9C56 5%, #DECCB3 32%, #BD8F4F 66%, #AA8146 84%, #CBDBA5 100%)' , WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' }} ></Box>
                                    <Box sx={{ width : "100px" , height : "130px" , borderRadius: '50%' ,display : "flex" , flexDirection : "column" , justifyContent : "center" , overflow : "hidden"}} >
                                        <Image alt="winner photo" src={item.isShownResult ? winner.student.url : (!(categories.indexOf(item) % 2) ? "/secretMale.png" : "/secretFemale.png" )} width={1000} height={1000} style={{ width : "100%" , height : "auto"}} />
                                    </Box>
                                </Box>
                                <Typography sx={{ fontFamily : "'Times New Roman', Times, serif" , color : "#B4884B" , fontSize : "25px" , textAlign: "center" }} >{item.name.toUpperCase()}</Typography>
                            </Box>
                        </Box>
                    )
                })
                :undefined}
            </Box>
        </Box>
    )}
    else if(user && !isTimeUp)
    return (
        <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , p : "10px"}}>
            <Typography variant="h5" sx={{ textAlign : "center"}} > Go to the selection page</Typography>
            <Button variant="contained" onClick={() => {
                dispatch(filterRelatedVotes(user.id))
                router.push("/intro/voting/selections");
            }} >Click me</Button>
        </Box>
    )
}

export default VotingResultPage;