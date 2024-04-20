import BackButton from "@/components/back-button";

const JoinPage = () => {
  return (
    <div className="py-10 md:py-20">
      <div className="flex flex-col items-center gap-y-3 md:gap-y-5">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          <span className="text-accent underline">Join</span> Poll
        </h1>

        <BackButton href="/" label="Home" />
      </div>
    </div>
  );
};

export default JoinPage;
