import React from 'react';
import styled from "styled-components";

const SlideWrapper = styled.div`
box-sizing:border-box;
padding:10px;
display: flex;
min-width:${props => props.width}%;
justify-content: center;
  & > div {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    & > *{
        width:100%;
        display:flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
    }
}
@media only screen and (max-width: 500px) {
    & {
      padding:0px;
};
`;
const Slide = ({children,width}) =>{
    return <SlideWrapper data-role = {'slide-wrapper'} width={width}>{children}</SlideWrapper>
}

export default Slide