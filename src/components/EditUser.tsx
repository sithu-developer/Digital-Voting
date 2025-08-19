import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { User } from "../../generated/prisma";
import { updateUser } from "@/store/slices/userSlice";
import { changeIsLoading, openSnackBar } from "@/store/slices/snackBarSlice";
import { Severity } from "@/types/snackBar";

interface Props {
    userEditUserOpen : boolean;
    setUserEditUserOpen : (value : boolean) => void;
}

const EditUser = ( { setUserEditUserOpen , userEditUserOpen } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const [ updatedUser , setUpdatedUser ] = useState<User>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user) {
            setUpdatedUser(user);
        }
    } , [user])

    if(!user || !updatedUser) return null;

    const handleUpdateUser = () => {
        dispatch(changeIsLoading(true));
        dispatch(updateUser({...updatedUser , isSuccess : () => {
            setUserEditUserOpen(false);
            dispatch(changeIsLoading(false));
            dispatch(openSnackBar({ open : true , message : "Name is successfully changed" , severity : Severity.success}))
        }}))
    }
    return (
        <Dialog open={userEditUserOpen} onClose={() => {
                setUserEditUserOpen(false);
                setUpdatedUser(user);
            }} 
            slotProps={{
                paper : {
                    sx : { borderRadius : "15px"}
                }
            }}
        >
            <DialogContent sx={{ bgcolor : "info.main" , display : "flex" , flexDirection : "column" , gap : "20px" }} >
                <Typography variant="h5" >Change Name</Typography>
                <TextField defaultValue={updatedUser.name} label="Name"  sx={{ '& .MuiOutlinedInput-root' : { color : "white"} }} onChange={(event) => setUpdatedUser({...updatedUser , name : event.target.value})} />
                <Box sx={{ display : "flex" , gap : "10px" , justifyContent : "end"}}>
                    <Button variant="contained" sx={{ bgcolor : "#7485E5", color : "black"  , borderRadius : "10px" , textTransform : "none" }} onClick={() => {
                        setUserEditUserOpen(false);
                        setUpdatedUser(user);
                    }} >Cancel</Button>
                    <Button disabled={!updatedUser.name || user.name === updatedUser.name} variant="contained" sx={{ bgcolor : "#7485E5" , color : "black" , borderRadius : "10px" , textTransform : "none" , '&.Mui-disabled' : { color : "GrayText" , bgcolor : "rgb(28, 32, 77)" , border : "1px solid GrayText"} }} onClick={handleUpdateUser}>Update</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default EditUser;