"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCounterValue } from "@/redux/counter/selectors";
import { increment, decrement } from "@/redux/counter/slice";

import { Button } from "@/components/ui/button";
import BackButton from "@/components/back-button";

import Transition from "@/components/ui/transition";

const CreatePage = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectCounterValue);

  return (
    <div className="py-10 md:py-20 h-full">
      <div className="flex flex-col items-center gap-y-3 md:gap-y-5">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          <span className="text-accent underline">Create</span> Poll
        </h1>

        <BackButton href="/" label="Home" />
      </div>

      <Transition className="h-[70%] flex items-center justify-center">
        <div className="flex justify-center items-center">
          <div>
            <p>Value: {value}</p>

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
        </div>
      </Transition>
    </div>
  );
};

export default CreatePage;
