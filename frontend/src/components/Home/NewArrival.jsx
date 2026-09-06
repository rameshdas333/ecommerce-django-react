import Title from '../Title/Title';

import Frame1 from '../../assets/Frame1.png';
import Frame2 from '../../assets/Frame2.png';
import Frame3 from '../../assets/Frame3.png';
import Frame4 from '../../assets/Frame 4.png';

import Service1 from '../../assets/Services.png';
import Service2 from '../../assets/Services (1).png';
import Service3 from '../../assets/Services (2).png';

const NewArrival = () => {
    const services = [
        {
            image: Service1,
            service: 'FREE AND FAST DELIVERY',
            name: 'Free delivery for all orders over $140',
        },
        {
            image: Service2,
            service: '24/7 CUSTOMER SERVICE',
            name: 'Friendly 24/7 customer support',
        },
        {
            image: Service3,
            service: 'MONEY BACK GUARANTEE',
            name: 'We return money within 30 days',
        },
    ];

    return (
        <section className="w-full">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">

                {/* Title */}
                <Title
                    name="Featured"
                    title="New Arrival"
                    titleSize="text-2xl sm:text-3xl"
                />

                {/* New Arrival Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-[30px]">

                    {/* Frame 1 */}
                    <div className="w-full">
                        <img
                            className="w-full h-auto object-cover"
                            src={Frame1}
                            alt="New Arrival"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="grid grid-cols-1 gap-5 md:gap-6 lg:gap-[30px]">

                        {/* Frame 2 */}
                        <div className="w-full">
                            <img
                                className="w-full h-auto object-cover"
                                src={Frame2}
                                alt="New Arrival"
                            />
                        </div>

                        {/* Frame 3 + Frame 4 */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-[30px]">

                            <div className="w-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src={Frame3}
                                    alt="New Arrival"
                                />
                            </div>

                            <div className="w-full">
                                <img
                                    className="w-full h-full object-cover"
                                    src={Frame4}
                                    alt="New Arrival"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    gap-12
                    md:gap-8
                    lg:gap-[88px]
                    max-w-[1100px]
                    mx-auto
                    my-10
                    sm:my-24
                    md:my-32
                    lg:my-[100px]
                ">

                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <img
                                className="pb-5 sm:pb-6 w-auto"
                                src={service.image}
                                alt={service.service}
                            />

                            <h3 className="
                                font-secoundary
                                pb-2
                                font-semibold
                                text-base
                                sm:text-lg
                                lg:text-xl
                                leading-6
                                lg:leading-7
                            ">
                                {service.service}
                            </h3>

                            <p className="
                                w-full
                                max-w-[249px]
                                font-primary
                                text-xs
                                sm:text-sm
                                leading-5
                            ">
                                {service.name}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default NewArrival;