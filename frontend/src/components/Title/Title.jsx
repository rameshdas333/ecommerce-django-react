



const Title = ({name,title}) => {
    return (
      <div>
      
          <div className="flex items-center gap-2 pb-5 pt-[27px]">
            <div className="w-5 h-10 bg-[#DB4444]  rounded-[4px]"></div>
            <p className="text-red-500 font-semibold ">{name}</p>
          </div>
      
             <h2 className="text-4xl font-semibold font-secoundary mb-5">
          {title}
          </h2>
        
      
      </div>
    );
};

export default Title;