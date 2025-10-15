import React, { useEffect, useState } from "react";

const Counter = ({ num }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setCounter(current);

      if (current >= num) {
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [num]);

  return <>{counter}</>;
};

export default Counter;
