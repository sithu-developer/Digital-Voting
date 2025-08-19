import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, IconButton, Typography } from "@mui/material"
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Students } from "../../../../../generated/prisma";
import { checkIsTimeUp, updateUser } from "@/store/slices/userSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";


const ThankForVoting = () => {
    const user = useAppSelector(store => store.userSlice.user);
    const isTimeUp = useAppSelector(store => store.userSlice.isTimeUp);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const students = useAppSelector(store => store.studentsSlice.students);
    const votes = useAppSelector(store => store.votesSlice.votes);
    const votedStudentIds = votes.map(item => item.studentId);
    const votedStudents = students.filter(item => votedStudentIds.includes(item.id));
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if(categories.length && votes.length && categories.length !== votes.length && router ) {
            router.push("/intro/voting/selections");
        }
    } , [categories , votes , router ])

    useEffect(() => {
        if(dispatch) {
            const interval = setInterval(() => {
                dispatch(checkIsTimeUp());
            } , 6000);
            return () => {
                clearInterval(interval);
            }
        }
    } , [ dispatch ])

    useEffect(() => {
        if(isTimeUp && router) {
            router.push("/intro/voting/results");
        }
    } , [ isTimeUp , router ])


    if(!user || categories.length !== votes.length) return null;

    const handleSubmitVotes = () => {
        dispatch(changeIsLoading(true));
        dispatch(updateUser({ ... user , isSubmitted : true , isSuccess : () => {
            dispatch(changeIsLoading(false));
            dispatch(openSnackBar({ open : true , message : "Successfully submitted " , severity : Severity.success}))
        }}))
    }

    return (
        <Box sx={{ position : "relative" , bgcolor : "#111136" , height : "100vh" , overflow : "hidden"}} >
            <Image alt="thank for voting Bg" src={"/thankForVotingBg.jpg"} height={1000} width={1000} style={{ width : "auto" , height : "100%" , opacity : "50%"}} />
            <Box sx={{ width : "fit-content" , position : "absolute" , left : "20px" , top : "35px"}}  >
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "'Times New Roman', Times, serif"}} >THANKS</Typography>
                <Typography variant="h4" sx={{ textAlign : "center" , fontFamily : "'Times New Roman', Times, serif"}}>FOR</Typography>
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "'Times New Roman', Times, serif"}}>VOTING</Typography>
                <Typography  sx={{ textAlign : "center" , fontFamily : "'Times New Roman', Times, serif"}} >Results will be announced soon</Typography>
            </Box>
            <Box sx={{ position : "absolute" , top : "255px" , borderRadius : "10px" , width : "95%" , display : "flex" , flexWrap : "wrap" , gap : "15px" , ml : "10px" , height : "calc(100vh - 450px)" , overflowY : "auto" , py : "10px" }}>
                {categories.map(item => {
                    const relatedStudent = votedStudents.find(stu => stu.categoryId === item.id) as Students;
                return (
                    <Box  key={item.id}>
                        <Typography sx={{ ml : "10px" , fontFamily : "'Times New Roman', Times, serif" }}>{item.name}</Typography>
                        <Box sx={{ display : "flex" , alignItems : "end", gap : "3px"}} >
                            <Box sx={{ width : "115px" , height : "115px" , bgcolor : "#28316B" , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center" , position : "relative" , overflow : "hidden" }}>
                                <Image alt="candidate photo" src={relatedStudent.url} width={1000} height={1000} style={{ width : "100%" , height : "auto"}} />
                                <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                                    <Image alt="number boundary" src={"/numberBoundary.svg"} width={100} height={100} style={{ width : "auto" , height : "auto"}} />
                                    <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{relatedStudent.contestantNumber}</Typography>
                                </Box>
                            </Box>
                            {!user.isSubmitted && <Box sx={{ bgcolor : "secondary.main" , borderRadius : "5px" , height : "21px" , width : "20px" , display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" }}>
                                <IconButton onClick={() => {
                                    router.push({ pathname : "/intro/voting/selections" , query : { categoryId : item.id }})
                                }}>
                                    <EditRoundedIcon sx={{ color : "black" , fontSize : "20px"}} />
                                </IconButton>
                            </Box>}
                        </Box>
                    </Box>
                )})}
            </Box>
            <Box sx={{ position : "absolute" , bottom : "130px" , display : "flex" , alignItems : "center" , gap : "20px" , ml : "40px"}}>
                <Typography sx={{ fontFamily : "'Times New Roman', Times, serif" , mt : "5px" }}>Your chosen candidates</Typography>
                <Button onClick={handleSubmitVotes} disabled={user.isSubmitted} sx={{ border : "1px solid white" , borderRadius : "15px" , fontFamily : "'Times New Roman', Times, serif" , py : "1px" , textTransform : "none" , '&.Mui-disabled' : { color : "GrayText" , bgcolor : "rgb(28, 32, 77)" , border : "1px solid #FFD700"} }} variant="contained" >{user.isSubmitted ? "submitted" : "submit"}</Button>
            </Box>
            <Box sx={{ position : "absolute" , bottom : "-10px" , left : "50%" , transform: "translateX(-50%)" , width : "105%" , display : "flex" , justifyContent : "space-between"}} >
                <Image alt="cute cat" src={"/cuteCat.gif"} width={300} height={300} style={{ width : "150px" , height : "auto" }} />
                <Image alt="runnng cute" src={"/floweringCute.gif"} width={300} height={300} style={{ width : "150px" , height : "auto" }} />
            </Box>
        </Box>
    )
}

export default ThankForVoting;