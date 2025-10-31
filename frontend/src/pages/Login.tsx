// frontend/src/pages/Login.tsx
import { Box, Button, Typography } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";

import { IoIosLogIn } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login=()=> {

    const auth = useAuth()
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try {
            toast.loading("Signing In",{id:"login"});
            await auth?.login(email,password);
            toast.success("Signed In successfully",{id:"login"})

        } catch (error) {
            console.log(error);
            toast.error("Signing In Failed",{id:"login"});
        }
    }
  return (
    <Box sx={{ width: "100%", display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Image column (hidden on small; visible md and up) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },   // simpler responsive rule
          justifyContent: "center",
          alignItems: "center",
          p: 4
        }}
      >
        <img
          src="/airobot.png"                      // lives in /public
          alt="Robot"
          style={{ width: 400, height: "auto", maxWidth: "100%" }}
        />
      </Box>

      {/* Form column placeholder */}
      <Box
        
          flex= {1}
          display= "flex"
          justifyContent= "center"
          alignItems= "center"
          padding= {2}
          ml={"auto"} 
          mt={16}
      >
        <form 
            onSubmit={handleSubmit}
            style={{
            margin:'auto',
            padding:"30px",
            boxShadow:"10px 10px 20px #000",
            borderRadius:"10px",
            border:"none"
            }} action="">
                <Box 
                    sx={{
                        display:"flex", 
                        flexDirection:"column", 
                        justifyContent:"center"
                         }}>

                    <Typography variant="h4" textAlign={"center"} padding={2} fontWeight={600}>Login</Typography>
                    <CustomizedInput type="email" name="email" label="Email"></CustomizedInput>
                    <CustomizedInput type="password" name="password" label="Password"></CustomizedInput>
                    <Button type="submit" sx={{
                        px:2,
                        py:2,
                        mt:2,
                        width:"400px",
                        borderRadius:2,
                        bgcolor:"#00fffc",
                        ":hover":{
                            bgcolor:"white",
                            color: "black",
                        }
                        }} endIcon={<IoIosLogIn /> }>Login</Button>
                </Box>
            </form>
        {/* TODO: your form goes here */}
      </Box>
    </Box>
  );
}

export default Login;
