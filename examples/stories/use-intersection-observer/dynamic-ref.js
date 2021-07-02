import React, { Fragment } from "react";
import { storiesOf } from "@storybook/react";
import { styled } from "@material-ui/core";

import { useIntersectionObserver } from "react-use-observer";

// const Box = React.forwardRef(({ ratio, children, ...props }, ref) => (
//   <div
//     ref={ref}
//     style={{
//       position: "relative",
//       backgroundColor: "#f5f5f5",
//       height: 250,
//       width: 250,
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//     }}
//     {...props}
//   >
//     <span
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//       }}
//     >
//       {`${ratio}%`}
//     </span>
//     {children}
//     <span
//       style={{
//         position: "absolute",
//         bottom: 0,
//         right: 0,
//       }}
//     >
//       {`${ratio}%`}
//     </span>
//   </div>
// ));

export const DivStyled = styled("div")(() => ({
  backgroundColor: "red",
  position: "relative",
  height: 250,
  width: 250,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
}));

const dummyArray = new Array(5).fill("");

const DynamicRefIntersectionObserverStory = () => {
  const commonOptions = {
    root: null,
    rootMargin: "0px",
    threshold: Array(1 / 0.01)
      .fill(0.01)
      .map((current, index) => current * index),
  };
  const [firstRef, firstEntry] = useIntersectionObserver({
    threshold: [0.5],
  });

  const ratio = Math.floor((firstEntry ? firstEntry.intersectionRatio : 1) * 100);

  return (
    <Fragment>
      <p>Scroll Me</p>
      <div
        style={{
          height: 1500,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {dummyArray.map((_, index) => (
          <DivStyled
            key={`key${index}`}
            ref={index === 0 ? firstRef : undefined}
            // ratio={index === 0 ? ratio : 100}
          >
            Box {index + 1} {index === 0 ? ratio : 100}%
          </DivStyled>
        ))}
      </div>
    </Fragment>
  );
};

storiesOf("useIntersectionObserver", module).add("Dynamic Ref", () => (
  <DynamicRefIntersectionObserverStory />
));
