import { ReactNode } from 'react';

interface IHomePageInfoBoxProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const HomePageInfoBox = ({
  icon,
  title,
  description,
}: IHomePageInfoBoxProps): ReactNode => {
  return (
    <div className="text-center p-6 w-1/3 bg-[rgba(0,0,0,0.7)] max-[1000px]:w-full max-[1000px]:mb-4">
      <div className="flex justify-center mb-4">
        {icon}
        <h3 className="text-lg mt-2 ml-4 font-semibold">{title}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default HomePageInfoBox;
