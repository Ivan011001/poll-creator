import Transition from "@/components/ui/transition";

const WaitingPage = () => {
  return (
    <div className="py-10 md:py-20 h-full">
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        <span className="text-accent underline">Waiting</span> Room
      </h1>

      <Transition className="h-[70%] flex items-center justify-center">
        <p>TODO: the list of connected people</p>
      </Transition>
    </div>
  );
};

export default WaitingPage;
