// frontend/src/components/shared/Logo.tsx
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
      <Link
        to="/"
        style={{
          display: 'flex',           
          alignItems: 'center',
          gap: '12px',               
          textDecoration: 'none'     
        }}
      >
        <img
          src="/openai.png"          
          alt="openai"
          width={30}
          height={30}
          className="image-inverted"
        />
        <Typography
          sx={{
            
            display: 'block',
            fontWeight: 800,
            textShadow: '2px 2px 20px #000',
            color: 'white',          
            ml: 0.5                  
          }}
        >
          <span style={{ fontSize: 20 }}>MERN</span>-GPT
        </Typography>
      </Link>
    </div>
  );
};

export default Logo;
