import { useAppSelector } from "@/store/hooks";
import { Box, Button, Divider, Typography } from "@mui/material"
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Categories } from "../../../../../generated/prisma";
import { zodiacSigns } from "@/util/general";
import { ZodiacSignType } from "@/types/general";

const KingSelectionPage = () => {
    const user = useAppSelector(store => store.userSlice.user);
    const [ selectedCategory , setSelectedCategory ] = useState<Categories>();
    const students = useAppSelector(store => store.studentsSlice.students);
    const relatedStudents = students.filter(item => item.categoryId === selectedCategory?.id);
    const sortedStudents = [...students].sort((a,b) => a.contestantNumber - b.contestantNumber )

    
    if(user)
    return (
        <Box sx={{ position : "relative" , width : "100vw" , height : "100vh" , bgcolor : "#031020" , overflow : "hidden" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"  }}  >
            <img src={"/selectionBackground.jpg"} style={{ height : "100vh" }} />
            <Box sx={{ position : "absolute" , top : "75px" , width : "100%" , display : "flex" , flexDirection : "column" , alignItems : "center" }} >
                <img src={"/kingCrown.png"} style={{ width : "18%" , position : "absolute" , top : "-53px" }} />
                <Box sx={{ display : "flex" , width : "75%" }}>
                    <Box sx={{ width: "35%", height: "12px", borderTop: "1px solid #BFCDEC"}} />
                    <Box sx={{ width: "30%", height: "12px", borderBottom : "1px solid #BFCDEC" , borderLeft : "1px solid #BFCDEC" , borderRight : "1px solid #BFCDEC" }} />
                    <Box sx={{ width: "35%", height: "12px", borderTop: "1px solid #BFCDEC" }} />
                </Box>
                <Typography sx={{ width : "100vw" , fontSize : "38px" , fontFamily : "Microsoft YaHei UI" , textAlign : "center" , color : "#DAE9FE" }} >KING SELECTION</Typography>
                <Box sx={{ display : "flex" , alignItems : "center"  , width : "75%"}}>
                    <Box sx={{ width: "35%", borderTop: "1px solid #BFCDEC"}} />
                    <Typography sx={{ width : "30%" , fontFamily : "Monotype Corsiva" , textAlign : "center" , lineHeight : 1 , color : "#BFCDEC"}} >LET'SVOTE</Typography>
                    <Box sx={{ width: "35%", borderTop: "1px solid #BFCDEC" }} />
                </Box>
            </Box>
            <Box sx={{ position : "absolute" , top : "180px" , borderRadius : "10px" , width : "95%" , display : "grid" , gridTemplateColumns : "repeat(auto-fill, minmax(100px, 1fr))" , gap : "10px" , overflowY : "auto", maxHeight : "calc(100vh - 300px)" }}>
                {sortedStudents.map(item => {
                const currentZodiac = zodiacSigns.find(zodiac => zodiac.id === item.zodiacId) as ZodiacSignType;
                return (
                <Link href={`/intro/backoffice/king-queen/${item.id}`} key={item.id} style={{ textDecoration : "none"}} >
                    <Box sx={{ width : "115px" , height : "140px" , background : `radial-gradient(ellipse at center,#AAB6F8 5%,#8D9CF2 25%,#5B6DD7 55%,#3747A3 75%)` , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "start" , alignItems : "center" , position : "relative" , overflow : "hidden" }} >
                        <img alt="king photo" src={item.url} style={{ width : "100%"}} />
                        <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                            <img alt="number boundary" src={ item.url.includes("Default") ? "/numberBoundaryWithBg.svg" : "/numberBoundary.svg"}/>
                            <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{item.contestantNumber}</Typography>
                        </Box>
                        <Box sx={{ position : "absolute" , bottom : "0px" , bgcolor : "info.main" , width : "100%" , display : "flex"  , flexDirection : "column" , justifyContent : "center" , alignItems : "center" , gap : "3px" , p : "5px" , borderRadius : "15px" }} >
                            <Typography sx={{ fontSize : "12px" , lineHeight : 1}} >{item.name} {currentZodiac.zodiac.replace(/^.*?-|\s*\(.*?\)/g, '')}</Typography>
                            <Typography sx={{ fontSize : "12px" , lineHeight : 1}}>{ item.year  + " " + item.major }</Typography>
                        </Box>
                    </Box>
                </Link>
                )})}
            </Box>
            {/* 
            <Button variant="contained" onClick={() => {
                localStorage.clear();
                signOut({callbackUrl : "/intro"})
            }} >sing out</Button> */}
        </Box>
    )
    else 
    return (
        <Box>
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default KingSelectionPage;