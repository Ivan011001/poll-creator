import { useState } from "react";

import { Button } from "./ui/button";

interface IVotesRangeProps {
  min: number;
  max: number;
  initial: number;
  step: number;
  onChange: (val: number) => void;
}

const VotesRange = ({
  min,
  max,
  initial,
  step,
  onChange,
}: IVotesRangeProps) => {
  const [current, setCurrent] = useState(initial);

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="secondary"
        type="button"
        size="icon"
        className="btn-round btn-round-orange"
        disabled={current - step < min}
        onClick={() => {
          setCurrent(current - step);
          onChange(current - step);
        }}
      >
        -
      </Button>
      <div className="text-2xl font-bold">{current}</div>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="btn-round btn-round-orange"
        disabled={current + step > max}
        onClick={() => {
          setCurrent(current + step);
          onChange(current + step);
        }}
      >
        +
      </Button>
    </div>
  );
};

export default VotesRange;
