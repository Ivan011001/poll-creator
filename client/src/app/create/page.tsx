"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCounterValue } from "@/redux/counter/selectors";
import { increment, decrement } from "@/redux/counter/slice";

import { Button } from "@/components/ui/button";

const CreatePage = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectCounterValue);

  return (
    <div>
      <p>Valu: {value}</p>

      <div>
        <Button
          onClick={() => {
            dispatch(increment(2));
          }}
        >
          Increment
        </Button>
        <Button
          onClick={() => {
            dispatch(decrement(2));
          }}
        >
          Decrement
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
