import React from "react";
import { Button } from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

interface CreateLoProps {
  onClick: () => void;
}
const CreateLo: React.FC <CreateLoProps>= ({ onClick }) => {
  const navigate = useNavigate();
  const create = (): void => {
      navigate("/join");
    };
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      onClick={onClick}
    >
      Create Lobby
    </Button>
  );
};

export default CreateLo;

/*onClick={() => {
        console.log("Looking to create a lobby");
        create();
      }}*/



/*  
  

export const Button = props => {
  const create = (): void => {
    const navigate = useNavigate();
    navigate("/create");
  };
  let c =
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-button ${props.className}`}
    onClick={() => 
      create()
      
    }
    >
    {props.children}
  </button>;
  return c;
};


Button.propTypes = {
  width: PropTypes.number,
  style: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
export default Button;

/*
import React from "react";
import { Button } from "@nextui-org/react";
import {useNavigate} from "react-router-dom";




const CreateLo =  () => {
  const create = (): void => {
    const navigate = useNavigate();
    navigate("/create");
  };
  
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      onClick={() => 
        create()
        
      }
    >
      Create Lobby
    </Button>
  );
};

export default CreateLo;*/