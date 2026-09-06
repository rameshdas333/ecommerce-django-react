
import moment from 'moment';
import enhance from '../../assets/enhance.jpg';

const MusicExperience = () => {
    return (
        <div className="mb-10 sm:mb-12 md:mb-14 lg:mb-16">

            <div
                className="
                    min-h-[500px]
                    rounded-md
                    bg-cover
                    bg-center
                    bg-no-repeat
                    px-5 sm:px-8 md:px-10 lg:px-14
                    py-10 sm:py-12 md:py-14 lg:py-16
                "
                style={{ backgroundImage: `url(${enhance})` }}
            >

                {/* Category */}
                <p
                    className="
                        text-[#00FF66]
                        font-semibold
                        text-sm sm:text-base
                        font-primary
                        leading-5
                    "
                >
                    Categories
                </p>

                {/* Title */}
                <h1
                    className="
                        text-white
                        font-secoundary
                        font-semibold
                        text-3xl
                        sm:text-4xl
                        md:text-5xl
                        leading-9
                        sm:leading-10
                        md:leading-[60px]
                        w-full
                        sm:max-w-[443px]
                        py-5 sm:py-6 md:py-8
                    "
                >
                    Enhance Your Music Experience
                </h1>

                {/* Timer */}
                <div
                    className="
                        flex
                        flex-wrap
                        gap-3
                        sm:gap-4
                        items-center
                        pb-8
                    "
                >

                    {/* Hours */}
                    <div
                        className="
                            bg-white
                            rounded-full
                            h-14 w-14
                            sm:h-[62px] sm:w-[62px]
                            text-[10px] sm:text-[12px]
                            font-semibold
                            font-primary
                            flex flex-col
                            items-center
                            justify-center
                        "
                    >
                        {moment().hours()}
                        <p>Hours</p>
                    </div>

                    {/* Days */}
                    <div
                        className="
                            bg-white
                            rounded-full
                            h-14 w-14
                            sm:h-[62px] sm:w-[62px]
                            text-[10px] sm:text-[12px]
                            font-semibold
                            font-primary
                            flex flex-col
                            items-center
                            justify-center
                        "
                    >
                        {moment().days()}
                        <p>Days</p>
                    </div>

                    {/* Minutes */}
                    <div
                        className="
                            bg-white
                            rounded-full
                            h-14 w-14
                            sm:h-[62px] sm:w-[62px]
                            text-[10px] sm:text-[12px]
                            font-semibold
                            font-primary
                            flex flex-col
                            items-center
                            justify-center
                        "
                    >
                        {moment().minutes()}
                        <p>Minutes</p>
                    </div>

                    {/* Seconds */}
                    <div
                        className="
                            bg-white
                            rounded-full
                            h-14 w-14
                            sm:h-[62px] sm:w-[62px]
                            text-[10px] sm:text-[12px]
                            font-semibold
                            font-primary
                            flex flex-col
                            items-center
                            justify-center
                        "
                    >
                        {moment().seconds()}
                        <p>Seconds</p>
                    </div>

                </div>

                {/* Button */}
                <button
                    className="
                        bg-[#00FF66]
                        hover:bg-[#00dd59]
                        transition
                        rounded
                        px-8
                        sm:px-10
                        md:px-12
                        py-3
                        sm:py-4
                        text-sm
                        sm:text-base
                        font-medium
                    "
                >
                    Buy Now!
                </button>

            </div>
        </div>
    );
};

export default MusicExperience;
