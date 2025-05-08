import { useAppSelector } from "@/store/hooks";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useState } from "react";
import NewCategory from "@/components/NewCategory";

const KingQueenPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ newCategoryOpen , setNewCategoryOpen ] = useState<boolean>(false);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    
    if(admin) 
    return (
        <Box sx={{ display : "flex" , flexDirection : "column" , gap : "10px"}} >
            <Box sx={{  p : "5px 10px" , display : "flex" , alignItems : "center" , gap : "10px" }} >
                <IconButton onClick={() => setNewCategoryOpen(true)} >
                    <AddCircleOutlineRoundedIcon sx={{ color : "black" , fontSize : "40px"}} />
                </IconButton>
                <Box sx={{ display : "flex" , gap : "8px" , flexGrow : 1 , overflow : "hidden" , overflowX : "auto"}}>
                    {categories.map(item => (
                        <Chip  key={item.id} label={item.name} variant="outlined" onClick={() => {}} />
                    ))}
                </Box>
            </Box>
            <NewCategory newCategoryOpen={newCategoryOpen} setNewCategoryOpen={setNewCategoryOpen} />
        </Box>
    )
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro"} >Click here</Link></Typography>
        </Box>
    )
}

export default KingQueenPage;