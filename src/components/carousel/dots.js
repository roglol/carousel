import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  padding: 0px;
  position: absolute;
  bottom: 15px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  & > span {
    cursor: pointer;
    margin: 0px 5px;
    background-color: #eee;
    border: 1px solid #666;
    border-radius: 5px;
    box-shadow: inset 1px 1px 1px #888;
    display: inline-block;
    height: 8px;
    width: 8px;
    &.active {
      background-color: #41abe5;
      box-shadow: inset 2px 0px 2px -2px #333;
    }
    &:hover {
      background-color: #41abe5;
      box-shadow: inset 2px 0px 2px -2px #333;
    }
  }
`;

const Dots = ({ currentSlide, count, onClick, dots }) => {
  return (
    dots && (
      <StyledDiv>
        {new Array(count).fill(0).map((item, key) => {
          return (
            <span
              key={key}
              className={key === currentSlide ? "active" : ""}
              data-slide={key + 1}
              onClick={onClick}
            ></span>
          );
        })}
      </StyledDiv>
    )
  );
};

export default Dots;
