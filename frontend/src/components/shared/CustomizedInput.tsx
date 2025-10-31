import React from "react";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      name={props.name}
      label={props.label}
      type={props.type}
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{
        // typed text color
        "& .MuiInputBase-input": {
          color: "white",
        },
        // placeholder color (if you use placeholder)
        "& .MuiInputBase-input::placeholder": {
          color: "rgba(255,255,255,0.6)",
          opacity: 1,
        },
        // label default + focused color
        "& .MuiInputLabel-root": {
          color: "rgba(255,255,255,0.8)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "white",
        },
        // outline colors (default, hover, focused)
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        },
      }}
    />
  );
};

export default CustomizedInput;
