import React from "react";
import styled, { css } from "styled-components";

const blueColor = "#00bcdd";
const pinkColor = "#ff00ff";
const slateColor = "rgb(16,24,50)";

const transitionAll = css`
  -webkit-transition: all 200ms ease-in-out;
  -moz-transition: all 200ms ease-in-out;
  -o-transition: all 200ms ease-in-out;
  transition: all 200ms ease-in-out;
`;

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  color: ${slateColor};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: inline-block;
  letter-spacing: 0.075em;
  padding: 0.8em 1em;
  margin: auto 2em;
  position: relative;
  text-transform: uppercase;
  border: 3px solid ${blueColor};
  background-color: ${({ disabled }) => (disabled ? "grey" : "white")};
  z-index: 1;
  box-shadow: -0.5em 0.5em transparent;
  transform-origin: left bottom;
  ${transitionAll};

  &:before,
  &:after {
    border: 3px solid ${blueColor};
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
  }

  /* Side shadow */
  &:before {
    left: -0.59em;
    top: 0.15em;
    width: 0.31em;
    height: 100%;
    transform: skewY(-45deg);
  }

  /* Bottom shadow */
  &:after {
    bottom: -0.61em;
    right: 0.16em;
    width: 100%;
    height: 0.31em;
    transform: skewX(-45deg);
  }

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "grey" : "white")};
    transform: translate(0.5em, -0.5em);
    box-shadow: ${({ disabled }) =>
      !disabled ? "-1em 1em 0.15em rgba(16, 24, 50, 0.1)" : "none"};

    &:before {
      height: calc(100% - 0.13em);
    }

    &:after {
      width: calc(100% - 0.13em);
    }
  }
`;

const ThreeDButton = ({ disabled, onClick, children }: ButtonProps) => {
  return (
    <StyledButton disabled={disabled} onClick={!disabled ? onClick : undefined}>
      {children}
    </StyledButton>
  );
};

export default ThreeDButton;
