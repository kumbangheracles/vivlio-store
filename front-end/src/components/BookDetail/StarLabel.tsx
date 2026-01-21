import { StarFilled } from "@ant-design/icons";

interface PropTypes {
  total_star?: number;
  className?: string;
}

const StarLabel = ({ total_star = 0, className }: PropTypes) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarFilled
          key={index}
          className={index < total_star ? "!text-amber-300" : "!text-gray-400"}
        />
      ))}
    </div>
  );
};

export default StarLabel;
