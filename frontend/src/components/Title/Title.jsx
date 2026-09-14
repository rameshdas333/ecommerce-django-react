
const Title = ({ name, title }) => {
  return (
    <div>
      <div className="flex items-center gap-2 pb-3 pt-5 sm:pb-5 sm:pt-[27px]">
        <div className="w-4 h-8 sm:w-5 sm:h-10 bg-[#DB4444] rounded-[4px]"></div>

        <p className="text-sm sm:text-base text-red-500 font-semibold">
          {name}
        </p>
      </div>

      <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold font-secoundary mb-4 sm:mb-5">
        {title}
      </h2>
    </div>
  );
};

export default Title;

