import { RootState } from "@/redux/store";

export const selectCounterValue = (state: RootState) => state.counter.value;
