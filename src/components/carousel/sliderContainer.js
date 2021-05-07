import styled from "styled-components";

/*
adding attribiute to styled div because,
when i applied props directly it caused too many rerenders
and broke carousel
*/
const SliderContainer = styled.div.attrs(
  ({ currentSlide,offSet,width }) => ({
    style: {
      transform: `translateX(${offSet ? offSet +'px' : currentSlide===1 ? -100 + '%'  : -currentSlide * width +'%'})`
    }
  })
)`
  display:flex;
  height:100%;
  touch-action:none;
  transition-timing-function: ease;
  transition-duration: ${props => props.transition}s; 
  `;



  export default SliderContainer

