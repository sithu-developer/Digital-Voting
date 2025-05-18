import { useAppSelector } from "@/store/hooks";
import { Box, Button, IconButton, Typography } from "@mui/material"
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Students } from "../../../../../generated/prisma";


const ThankForVoting = () => {
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const students = useAppSelector(store => store.studentsSlice.students);
    const votes = useAppSelector(store => store.votesSlice.votes);
    const votedStudentIds = votes.map(item => item.studentId);
    const votedStudents = students.filter(item => votedStudentIds.includes(item.id));

    return (
        <Box sx={{ position : "relative" , bgcolor : "#111136" , height : "100vh"}} >
            <img src={"/thankForVotingBg.jpg"} style={{ height : "100%" , opacity : "50%"}} />
            <Box sx={{ width : "fit-content" , position : "absolute" , left : "20px" , top : "60px"}}  >
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}} >THANKS</Typography>
                <Typography variant="h4" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}}>FOR</Typography>
                <Typography variant="h3" sx={{ textAlign : "center" , fontFamily : "Javanese Text"}}>VOTING</Typography>
                <Typography  sx={{ textAlign : "center" , fontFamily : "Javanese Text"}} >Results will be announced soon</Typography>
            </Box>
            <Box sx={{ position : "absolute" , top : "255px" , borderRadius : "10px" , width : "95%" , display : "flex" , flexWrap : "wrap" , gap : "15px" , ml : "10px" , height : "calc(100vh - 450px)" , overflowY : "auto" , py : "10px" }}>
                {categories.map(item => {
                    const relatedStudent = votedStudents.find(stu => stu.categoryId === item.id) as Students;
                return (
                    <Box  key={item.id}>
                        <Typography sx={{ ml : "10px" , fontFamily : "Javanese Text" }}>{item.name}</Typography>
                        <Box sx={{ display : "flex" , alignItems : "end", gap : "3px"}} >
                            <Box sx={{ width : "115px" , height : "115px" , background : `radial-gradient(ellipse at center,#AAB6F8 5%,#8D9CF2 25%,#5B6DD7 55%,#3747A3 75%)` , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center" , position : "relative" , overflow : "hidden" }}>
                                <img alt="king photo" src={relatedStudent.url} style={{ width : "100%"}} />
                                <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                                    <img alt="number boundary" src={ relatedStudent.url.includes("Default") ? "/numberBoundaryWithBg.svg" : "/numberBoundary.svg"}/>
                                    <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{relatedStudent.contestantNumber}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ bgcolor : "secondary.main" , borderRadius : "5px" , height : "21px" , width : "20px" , display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" }}>
                                <IconButton>
                                    <EditRoundedIcon sx={{ color : "black" , fontSize : "20px"}} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                )})}
            </Box>
            <Box sx={{ position : "absolute" , bottom : "130px" , display : "flex" , alignItems : "center" , gap : "20px" , ml : "40px"}}>
                <Typography sx={{ fontFamily : "Javanese Text" , mt : "5px" }}>Your chosen candidates</Typography>
                <Button sx={{ border : "1px solid white" , py : "1px" , textTransform : "none" }} variant="contained" >Submit</Button>
            </Box>

        </Box>
    )
}

export default ThankForVoting;