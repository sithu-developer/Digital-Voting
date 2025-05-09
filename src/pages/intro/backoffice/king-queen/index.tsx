import { useAppSelector } from "@/store/hooks";
import { Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useEffect, useState } from "react";
import NewCategory from "@/components/NewCategory";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditCategory from "@/components/EditCategory";
import { Categories } from "../../../../../generated/prisma";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DeleteComfirmation from "@/components/DeleteComfirmation";

const KingQueenPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ newCategoryOpen , setNewCategoryOpen ] = useState<boolean>(false);
    const [ editCategoryOpen , setEditCategoryOpen ] = useState<boolean>(false);
    const [ selectedCategory , setSelectedCategory ] = useState<Categories>();
    const [ deleteOpen , setDeleteOpen ] = useState<boolean>(false);
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    
    useEffect(() => {
        if(categories.length && localStorage) {
            const selsectedCategoryId = Number(localStorage.getItem("selectedCategoryId"));
            const selectedCategory = categories.find(item => item.id === selsectedCategoryId);
            if(selectedCategory) {
                setSelectedCategory(selectedCategory);
            } else {
                setSelectedCategory(categories[0]);
                localStorage.setItem("selectedCategoryId" , String(categories[0].id))
            }
        }
    } , [categories])
    
    if(admin) 
    return (
        <Box sx={{ display : "flex" , flexDirection : "column" }} >
            <Box sx={{  px : "10px" , display : "flex" , alignItems : "center" , gap : "1px" }} >
                <IconButton onClick={() => setNewCategoryOpen(true)} >
                    <AddCircleOutlineRoundedIcon sx={{ color : "black" , fontSize : "35px"}} />
                </IconButton>
                <Box sx={{ display : "flex" , gap : "8px" , flexGrow : 1 , overflow : "hidden" , overflowX : "auto" , py : "8px"}}>
                    {selectedCategory && categories.map(item => (
                        <Chip  key={item.id} sx={{ bgcolor : (selectedCategory.id === item.id ? "info.dark" : "") , '&:hover' : { bgcolor : "info.dark"} , color : (selectedCategory.id === item.id ? "white" : "black") }} label={item.name} onClick={() => {
                            localStorage.setItem("selectedCategoryId" , String(item.id))
                            setSelectedCategory(item);
                        }} />
                    ))}
                </Box>
                <IconButton onClick={() => setEditCategoryOpen(true) } >
                    <EditRoundedIcon sx={{ color : "black"}} />
                </IconButton>
                <IconButton onClick={() => {
                    setDeleteOpen(true);
                }} >
                    <DeleteOutlineRoundedIcon sx={{ color : "black"}} />
                </IconButton>
            </Box>
            <Divider variant="middle" sx={{ bgcolor : "black"}} />
            

            <NewCategory newCategoryOpen={newCategoryOpen} setNewCategoryOpen={setNewCategoryOpen} />
            {selectedCategory && <EditCategory selectedCategory={selectedCategory} editCategoryOpen={editCategoryOpen} setEditCategoryOpen={setEditCategoryOpen} />}
            <DeleteComfirmation deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} categoryToDelete={selectedCategory} />
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