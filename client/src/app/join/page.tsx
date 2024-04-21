import BackButton from "@/components/back-button";
import Transition from "@/components/ui/transition";
import JoinPollForm from "@/components/join-poll-form";

const JoinPage = () => {
  return (
    <div className="py-10 md:py-20 h-full">
      <div className="flex flex-col items-center gap-y-3 md:gap-y-5">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          <span className="text-accent underline">Join</span> Poll
        </h1>

        <BackButton href="/" label="Home" />
      </div>

      <Transition className="h-[70%] flex items-center justify-center">
        <JoinPollForm />
      </Transition>
    </div>
  );
};

export default JoinPage;
