import React,{useState,useEffect,useRef} from 'react';
import styled from "styled-components";
import SliderContainer from './sliderContainer'
import Slide from './slide';
import Dots from './dots';
import Arrow from './arrow';


const StyledContainer = styled.div`
height:100%;
overflow: hidden;
position:relative
`;



const Carousel = ({children,settings}) =>{
    const transitionRef = useRef()
    const swipeStartRef = useRef()
    const swipeEndRef = useRef()
    const swipeMoveRef = useRef()
    const containerRef = useRef()
    const [slideCount,setSlideCount] = useState(0)
    const [moving,setMoving] = useState(false)
    const [initialPosition,setInitialPosition] = useState(0)
    const [offSet,setOffSet] = useState(0)
    const [itemWidth,setItemWidth] = useState(0)
    const [sliderItems,setSliderItems] = useState([])
    const [transition,setTransition] = useState(0)
    const [currentSlide,setCurrentSlide] = useState(1)
    const slidesToShow = 1;

    //incrementing currentSlide index after moving to next slide
    //disabling next arrow button if i am on the last slide
    const nextSlide = () =>{
     if(currentSlide === (slideCount+1)) return
      setCurrentSlide(currentSlide+1)
      
    }
    //decrementing currentSlide index after moving to first slide
     //disabling next arrow button if i am on the firstslide
    const prevSlide = () =>{
      if(currentSlide === 0) return
      setCurrentSlide(currentSlide-1)
    }
    //transitioning to the first or last slide for infinite scrolling
    const smoothTransition = (e) =>{       
            if(currentSlide===(slideCount+1)){   
                setCurrentSlide(1)
                setTransition(0)           
              }
              if(currentSlide===0){
                setCurrentSlide(slideCount)
                setTransition(0)
              }
    }
    //setting currentSlide index based on data-sldie attribute which is defined inside the Dot component
    const clickDot = (e) =>{
         let currentSlide = +e.target.attributes['data-slide'].value   
         setCurrentSlide(currentSlide)        
    }
    /*
    slicing last and first elements of the children array(I use children props to make sure 
      that carousel can handle any child element), adding last as first element and first as last,
      this helps to transition smoothly from the edges in the case of infinite scroll
    */
    const sliderArr = () =>{
        let arr = React.Children.toArray(children)
        let emptySlots = slidesToShow - (arr.length % slidesToShow)
        let last = arr.slice(-emptySlots)
        let first = arr.slice(0,emptySlots)
        arr = [...last,...arr,...first]
        return arr;
    }
    //creating swipestart event that sets initialposition and moving variables
    const swipeStart = (e) =>{
        e.preventDefault();
        //check if i click inside slider item
        if(e.target.attributes['data-role']?.value==='slide-wrapper'){
             return;
        }
        //for mobile devices e.pageX is undefined so i use e.touches[0].pageX instead
        setInitialPosition(e.pageX ?? e.touches[0].pageX)
        setMoving(true)
    }

   const swipeMove = (e) =>{
     e.preventDefault();
     if(moving){
       //getting container width and transform value in pixels,
       //checking the difference between initial and current positons of cursor
       const containerWidth = containerRef.current.offsetWidth
       let transformMatrix = window.getComputedStyle(containerRef.current).getPropertyValue('transform')
       let transform = parseInt(transformMatrix.split(',')[4].trim())
       const currentPosition = e.pageX ?? e.touches[0].pageX
       const diff = currentPosition - initialPosition
       /*stop executing swiping function when the user is on the first slide 
       and moving on the left, or when the user is on the last slide and is moving on the right
      */
       if(!settings.infinite && currentSlide===1 && diff>0)  return
       if(!settings.infinite && currentSlide===slideCount && diff<0)  return
       //setting offset value to create an effect of smooth swiping
      let offSet = transform + diff
      setOffSet(offSet)
      //checking if difference betwen positons is greater or equal than the 5th of sldier item width
      if(Math.abs(diff) >= Math.abs(containerWidth/5)){
        //setting moving to false and offset to 0
        //if difference is greater than 0 i have to move to the previos slide otherwise to the next slide
        setMoving(false)
        setOffSet(0)
                if(diff>0){
                  if(currentSlide === 0) return
                    setCurrentSlide(currentSlide-1)
                }
                if(diff<0){
                  if(currentSlide === (slideCount+1)) return
                    setCurrentSlide(currentSlide+1)
                }
       }
     }
   }

    const swipeEnd = (e) =>{
      e.preventDefault();
      //setting to offset to 0, otherwise if transition doesnt take place slider position will be broken
      setOffSet(0)
      //setting moving to false, to make sure that after mouseup just hovering on slide item wont trigger change of position
      setMoving(false)
    }
       
    useEffect(() => {
        /* since i add eventlisteners once when component is mounted
         i need to change these refs references to make sure that they 
         have access to updated state values
        */
        transitionRef.current = smoothTransition
        swipeStartRef.current = (e) => swipeStart(e)
        swipeMoveRef.current = (e) => swipeMove(e)
        swipeEndRef.current = (e) => swipeEnd(e)
     })
    useEffect(() => {
        //setting initial variables
        setItemWidth(100/slidesToShow)
        setSlideCount(Math.ceil(React.Children.count(children)/slidesToShow))
        setSliderItems(sliderArr())  
        //getting transition and swipe functions with updated state values 
        const smooth = () => {
            transitionRef.current()
          }
        const swipeStart = (e) => {
            swipeStartRef.current(e)
        }
        const swipeMove = (e) => {
          swipeMoveRef.current(e)
        }
        const swipeEnd = (e) => {
          swipeEndRef.current(e)
        }
      //defining events
      //binding events to containerRef.current to avoid overriding other similar events on the page
     var transitionEnd = containerRef.current.addEventListener('transitionend',smooth)
     var gestureStart = containerRef.current.addEventListener('mousedown', (e) => swipeStart(e))
     var gestureMove = containerRef.current.addEventListener('mousemove', (e) => swipeMove(e))
     var gestureEnd = containerRef.current.addEventListener('mouseup', (e) => swipeEnd(e))
     var touchStart = containerRef.current.addEventListener('touchstart', (e) => swipeStart(e))
     var touchMove = containerRef.current.addEventListener('touchmove', (e) => swipeMove(e))
     var touchEnd = containerRef.current.addEventListener('touchend', (e) => swipeEnd(e))
        return () => {
          //removing events to avoid memory leak
          containerRef.current.removeEventListener('transitionend', transitionEnd);
          containerRef.current.removeEventListener('mousedown', gestureStart);
          containerRef.current.removeEventListener('mouseup', gestureEnd);
          containerRef.current.removeEventListener('mousemove', gestureMove);
          containerRef.current.removeEventListener('touchdown', touchStart);
          containerRef.current.removeEventListener('touchend', touchEnd);
          containerRef.current.removeEventListener('touchmove', touchMove);
        }
     },[]);

     //once i rich edges i disable transition to move to first and last elements smoothly after that i reset transition value
    useEffect(() => {
      if(transition===0) setTransition(0.5)
    },[transition]);

return(
  <StyledContainer>
      <SliderContainer 
      ref={containerRef}
      transition={transition} 
      offSet={offSet}
      currentSlide={currentSlide}
      width={itemWidth}
      >
      {sliderItems.map((child,key) =>{
          return <Slide
                  key={key}
                  width={itemWidth}
                 >
                     {child}
                </Slide>
    })}
      </SliderContainer>
      {(settings.infinite || currentSlide >1) 
      ? 
      <Arrow dir={'left'}  onClick={prevSlide}/>
      :
      null
      }
     {(settings.infinite || currentSlide <slideCount) 
      ? 
      <Arrow dir={'right'}  onClick={nextSlide}/>
      :
      null
      }
      {settings.dots && 
            <Dots 
            count={slideCount} 
            currentSlide={currentSlide-1}
            onClick={clickDot }
            />
      }
      </StyledContainer>
)
}

export default Carousel;