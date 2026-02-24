import { useEffect } from "react";

const globalTimer = {};

function useHandleCalls(fetchData, deps = [], key = 'timer') {

  useEffect(() => {
    if (globalTimer[key]) {
      clearTimeout(globalTimer[key]);
    }
    globalTimer[key] = setTimeout(() => {
      fetchData();
    }, 500);
  }, [...deps]);
}

export default useHandleCalls;
