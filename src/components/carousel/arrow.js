import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  z-index: 100;
  ${(props) => (props.dir === "left" ? "left: 10px" : "right: 10px")};
  cursor: pointer;
  background: 0 0;
  border: 0;
  justify-self: center;
  outline: 0;
  padding: 16px 8px;
  position: absolute;
  top: calc(50%);
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  & .coreSpriteRightChevron {
    background-position: -162px -98px;
    height: 30px;
    width: 30px;
    background-repeat: no-repeat;
    background-image: url("https://www.instagram.com/static/bundles/es6/sprite_core_32f0a4f27407.png/32f0a4f27407.png");
  }
  & .coreSpriteLeftChevron {
    background-position: -130px -98px;
    height: 30px;
    width: 30px;
    background-repeat: no-repeat;
    background-image: url("https://www.instagram.com/static/bundles/es6/sprite_core_32f0a4f27407.png/32f0a4f27407.png");
  }
  @media only screen and (max-width: 500px) {
    & .coreSpriteLeftChevron {
      display: none;
    }
    & .coreSpriteRightChevron {
      display: none;
    }
  }
`;

const Arrow = (props) => {
  return props.infinite || props.currentSlide > 1 ? (
    <StyledButton dir={props.dir} onClick={props.onClick}>
      <div
        className={
          props.dir === "left"
            ? "coreSpriteLeftChevron"
            : "coreSpriteRightChevron"
        }
      ></div>
    </StyledButton>
  ) : null;
};

export default Arrow;
