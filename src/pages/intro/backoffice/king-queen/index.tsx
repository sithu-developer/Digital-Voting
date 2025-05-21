import { useAppSelector } from "@/store/hooks";
import { Box, Button, Chip, Divider, IconButton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useEffect, useState } from "react";
import NewCategory from "@/components/NewCategory";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditCategory from "@/components/EditCategory";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DeleteComfirmation from "@/components/DeleteComfirmation";
import NewStudent from "@/components/NewStudent";
import { zodiacSigns } from "@/util/general";
import { ZodiacSignType } from "@/types/general";
import { Categories } from "../../../../../generated/prisma";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Image from "next/image";


const KingQueenPage = () => {
    const admin = useAppSelector(store => store.adminSlice.admin)
    const [ newCategoryOpen , setNewCategoryOpen ] = useState<boolean>(false);
    const [ editCategoryOpen , setEditCategoryOpen ] = useState<boolean>(false);
    const [ selectedCategory , setSelectedCategory ] = useState<Categories>();
    const [ deleteOpen , setDeleteOpen ] = useState<boolean>(false);
    const [ newStudentOpen , setNewStudentOpen ] = useState<boolean>(false);
    const [ searchOpen , setSearchOpen ] = useState(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const categories = useAppSelector(store => store.categoriesSlice.categories);
    const students = useAppSelector(store => store.studentsSlice.students);
    const relatedStudents = students.filter(item => item.categoryId === selectedCategory?.id).filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    const sortedStudents = relatedStudents.sort((a,b) => a.contestantNumber - b.contestantNumber )

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
        <Box sx={{ display : "flex" , flexDirection : "column"}} >
            <Box sx={{  px : "10px" , display : "flex" , alignItems : "center" , gap : "2px" }} >
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
                <Box sx={{ display : "flex"}}>
                    <IconButton onClick={() => setEditCategoryOpen(true) } >
                        <EditRoundedIcon sx={{ color : "black"}} />
                    </IconButton>
                    <IconButton onClick={() => {
                        setDeleteOpen(true);
                    }} >
                        <DeleteOutlineRoundedIcon sx={{ color : "error.main"}} />
                    </IconButton>
                </Box>
            </Box>
            <Divider variant="middle" sx={{ bgcolor : "black"}} />
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "10px", p : "10px"}}>
                <Box sx={{ display : "flex" , justifyContent : "space-between" , gap : "20px" , alignItems : "center"}} >
                    {searchOpen ? <Box sx={{ flexGrow : 1 , display : "flex" , justifyContent : "space-between", alignItems : "center"}}>
                        <TextField sx={{ ml : "20px"}} autoFocus variant="standard" placeholder="Search..." onChange={(event) => setSearchValue(event.target.value)} />
                        <IconButton onClick={() => {
                            setSearchValue("")
                            setSearchOpen(false)
                        }} >
                            <CloseRoundedIcon sx={{ color : "black"}} />
                        </IconButton> 
                    </Box>
                    :<Box sx={{ flexGrow : 1 , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                        {selectedCategory && <Box sx={{ display : "flex" , alignItems : "center" , gap : "5px" ,  ml : "20px"}} >
                            <Image alt="category icon" src={selectedCategory.iconUrl} width={100} height={100} style={{ width : "35px" , height : "35px"}} />
                            <Typography variant="h5" >{selectedCategory.name}</Typography>
                        </Box>}
                        <IconButton onClick={() => setSearchOpen(true)} >
                            <SearchRoundedIcon sx={{ color : "black"}} />
                        </IconButton>   
                    </Box>}
                    <Button variant="contained" onClick={() => setNewStudentOpen(true)} >Create</Button>
                </Box>
                <Box sx={{ display : "grid" , gridTemplateColumns : "repeat(auto-fill, minmax(100px, 1fr))" , gap : 2 , borderRadius : "10px" , overflowY : "auto" , maxHeight : "calc(100vh - 200px)" }}>
                    {sortedStudents.map(item => {
                    const currentZodiac = zodiacSigns.find(zodiac => zodiac.id === item.zodiacId) as ZodiacSignType;
                    return (
                    <Link href={`/intro/backoffice/king-queen/${item.id}`} key={item.id} style={{ textDecoration : "none"}} >
                        <Box sx={{ width : "115px" , height : "145px" ,  bgcolor : `#28316B` , borderRadius : "15px" , display : "flex" , flexDirection : "column" , justifyContent : "start" , alignItems : "center" , position : "relative" , overflow : "hidden" }} >
                            <Image alt="candidate photo" src={item.url} width={1000} height={1000} style={{ width : "100%" , height : "auto"}} />
                            <Box sx={{ position : "absolute" , top : "5px" , right : "5px"}}>
                                <Image alt="number boundary" src={"/numberBoundary.svg"} width={100} height={100} style={{ width : "auto" , height : "auto"}} />
                                <Typography sx={{ position : "absolute" , top : "0px" , left : "15%", textAlign : "center" , width : "22px"}} >{item.contestantNumber}</Typography>
                            </Box>
                            <Box sx={{ position : "absolute" , bottom : "0px" , bgcolor : "info.main" , width : "100%" , display : "flex"  , flexDirection : "column" , justifyContent : "center" , alignItems : "center" , gap : "3px" , p : "5px" , borderRadius : "15px" }} >
                                <Typography sx={{ fontSize : "12px" , lineHeight : 1 , textAlign : "center"}} >{item.name}{currentZodiac.zodiac.replace(/^.*?-|\s*\(.*?\)/g, '')}</Typography>
                                <Typography sx={{ fontSize : "12px" , lineHeight : 1}}>{ item.year  + " " + item.major }</Typography>
                            </Box>
                        </Box>
                    </Link>
                    )})}
                </Box>
            </Box>
            {selectedCategory && <NewStudent selectedCategory={selectedCategory} newStudentOpen={newStudentOpen} setNewStudentOpen={setNewStudentOpen} />}
            <NewCategory newCategoryOpen={newCategoryOpen} setNewCategoryOpen={setNewCategoryOpen} />
            {selectedCategory && <EditCategory selectedCategory={selectedCategory} editCategoryOpen={editCategoryOpen} setEditCategoryOpen={setEditCategoryOpen} />}
            <DeleteComfirmation deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} categoryToDelete={selectedCategory} />
        </Box>
    )
    else 
    return (
        <Box >
            <Typography variant="h5" sx={{ textAlign : "center"}} > Wait for the nextwork or go to intro page <Link href={"/intro/sign-up"} >Click here</Link></Typography>
        </Box>
    )
}

export default KingQueenPage;