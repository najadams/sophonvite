import React from 'react'

const ComponentToPrint = React.forwardRef((props, cref) => {
  console.log(props.products[0].name)
  return <div ref={cref}>My cool content here! { props.products[0].name}</div>;
});

export default ComponentToPrint;
 