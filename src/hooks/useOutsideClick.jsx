import React from "react";
export const useOutsideClick = (callback, exclude) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (e) => {
      if (
        ref?.current &&
        !ref?.current?.contains(e.target) &&
        exclude &&
        exclude?.current &&
        !exclude?.current?.contains(e.target)
      ) {
        callback();
      }
    };
  
    document.addEventListener("click", handleClick);
  
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback, exclude]);
  
  return ref;
};
