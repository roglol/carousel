import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SliderContainer from "./sliderContainer";
import Slide from "./slide";
import Dots from "./dots";
import { LeftArrow, RightArrow } from "./arrow";

const StyledContainer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const Carousel = ({ children, settings }) => {
  const containerRef = useRef();
  const [slideCount, setSlideCount] = useState(0);
  const [moving, setMoving] = useState(false);
  const [initialPosition, setInitialPosition] = useState(0);
  const [initialTransform, setInitialTransform] = useState(0);
  const [offSet, setOffSet] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [transition, setTransition] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [translate, setTranslate] = useState(100);

  //incrementing currentSlide index after moving to next slide
  //disabling next arrow button if i am on the last slide
  const nextSlide = () => {
    if (currentSlide === slideCount + 1) return;
    setCurrentSlide(currentSlide + 1);
    setTranslate((currentSlide + 1) * sliderWidth);
  };
  //decrementing currentSlide index after moving to first slide
  //disabling next arrow button if i am on the firstslide
  const prevSlide = () => {
    if (currentSlide === 0) return;
    setCurrentSlide(currentSlide - 1);
    setTranslate((currentSlide - 1) * sliderWidth);
  };
  //transitioning to the first or last slide for infinite scrolling
  const smoothTransition = (e) => {
    if (currentSlide === slideCount + 1) {
      setTranslate(sliderWidth);
      setCurrentSlide(1);
      setTransition(0);
    }
    if (currentSlide === 0) {
      setTranslate(slideCount * sliderWidth);
      setCurrentSlide(slideCount);
      setTransition(0);
    }
  };
  //setting currentSlide index based on data-sldie attribute which is defined inside the Dot component
  const clickDot = (e) => {
    const currentSlide = +e.target.attributes["data-slide"].value;
    setCurrentSlide(currentSlide);
    setTranslate(currentSlide * sliderWidth);
  };
  /*
    slicing last and first elements of the children array(I use children props to make sure 
      that carousel can handle any child element), adding last as first element and first as last,
      this helps to transition smoothly from the edges in the case of infinite scroll
    */
  const sliderArr = () => {
    const temp = React.Children.toArray(children);
    const last = temp[temp.length - 1];
    const first = temp[0];
    const arr = [last, ...temp, first];
    return arr;
  };
  //creating swipestart event that sets initialposition and moving variables
  const swipeStart = (e) => {
    if (e.pageX) {
      e.preventDefault();
    }
    //check if i click inside slider item
    if (e.target.attributes["data-role"]?.value === "slide-wrapper") {
      return;
    }
    //for mobile devices e.pageX is undefined so i use e.touches[0].pageX instead
    setInitialPosition(e.pageX ?? e.touches[0].pageX);

    const transformMatrix = window
      .getComputedStyle(containerRef.current)
      .getPropertyValue("transform");
    const transform = parseInt(transformMatrix.split(",")[4].trim());
    setInitialTransform(transform);
    setMoving(true);
  };

  const swipeMove = (e) => {
    if (moving) {
      setTransition(0);
      //getting container width and transform value in pixels,
      //checking the difference between initial and current positons of cursor
      const containerWidth = containerRef.current.offsetWidth;
      const currentPosition = e.pageX ?? e.touches[0].pageX;
      const diff = currentPosition - initialPosition;
      /*stop executing swiping function when the user is on the first slide 
       and moving on the left, or when the user is on the last slide and is moving on the right
      */
      if (!settings.infinite || currentSlide === 0) return;
      if (!settings.infinite || currentSlide === slideCount + 1) return;
      //setting offset value to create an effect of smooth swiping
      const offSet = initialTransform + diff;
      setOffSet(offSet);
      //checking if difference betwen positons is greater or equal than the 5th of sldier item width
      if (Math.abs(diff) >= Math.abs(containerWidth / 3)) {
        //setting moving to false and offset to 0
        //if difference is greater than 0 i have to move to the previos slide otherwise to the next slide
        setTransition(1);
        setMoving(false);
        setOffSet(0);
        if (diff > 0) {
          if (currentSlide === 0) return;
          setTranslate((currentSlide - 1) * sliderWidth);
          setCurrentSlide(currentSlide - 1);
        }
        if (diff < 0) {
          if (currentSlide === slideCount + 1) return;
          setTranslate((currentSlide + 1) * sliderWidth);
          setCurrentSlide(currentSlide + 1);
        }
      }
    }
  };

  const swipeEnd = (e) => {
    //setting to offset to 0, otherwise if transition doesnt take place slider position will be broken
    setTransition(1);
    setOffSet(0);
    //setting moving to false, to make sure that after mouseup just hovering on slide item wont trigger change of position
    setMoving(false);
  };

  useEffect(() => {
    //setting initial variables
    setSliderWidth(100);
    setTranslate(100);
    setSlideCount(Math.ceil(React.Children.count(children)));
    setCarouselItems(sliderArr());
  }, []);

  useEffect(() => {
    //defining events
    //binding events to containerRef.current to avoid overriding other similar events on the page
    containerRef.current.addEventListener("transitionend", smoothTransition);
    containerRef.current.addEventListener("mousedown", swipeStart);
    containerRef.current.addEventListener("mousemove", swipeMove);
    containerRef.current.addEventListener("mouseup", swipeEnd);
    containerRef.current.addEventListener("touchstart", swipeStart, {
      passive: true,
    });
    containerRef.current.addEventListener("touchmove", swipeMove, {
      passive: true,
    });
    containerRef.current.addEventListener("touchend", swipeEnd, {
      passive: true,
    });
    return () => {
      //removing events to avoid memory leak
      containerRef.current.removeEventListener(
        "transitionend",
        smoothTransition
      );
      containerRef.current.removeEventListener("mousedown", swipeStart);
      containerRef.current.removeEventListener("mouseup", swipeEnd);
      containerRef.current.removeEventListener("mousemove", swipeMove);
      containerRef.current.removeEventListener("touchstart", swipeStart);
      containerRef.current.removeEventListener("touchend", swipeEnd);
      containerRef.current.removeEventListener("touchmove", swipeMove);
    };
  }, [currentSlide, sliderWidth, slideCount, moving]);

  //once i rich edges i disable transition to move to first and last elements smoothly after that i reset transition value
  useEffect(() => {
    if (transition === 0 && !moving) setTransition(1);
  }, [transition]);

  return (
    <StyledContainer>
      <SliderContainer
        ref={containerRef}
        transition={transition}
        translate={translate}
        offSet={offSet}
      >
        {carouselItems.map((child, key) => {
          return (
            <Slide key={key} width={sliderWidth}>
              {child}
            </Slide>
          );
        })}
      </SliderContainer>
      <LeftArrow
        dir={"left"}
        onClick={prevSlide}
        count={slideCount}
        infinite={settings.infinite}
        currentSlide={currentSlide}
      />
      <RightArrow
        dir={"right"}
        onClick={nextSlide}
        count={slideCount}
        infinite={settings.infinite}
        currentSlide={currentSlide}
      />
      <Dots
        count={slideCount}
        currentSlide={currentSlide - 1}
        onClick={clickDot}
        dots={settings.dots}
      />
    </StyledContainer>
  );
};

export default Carousel;
