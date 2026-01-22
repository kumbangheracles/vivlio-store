import { useState } from "react";
import { StarFilled } from "@ant-design/icons";

interface AppRateProps {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const AppRate = ({
  max = 5,
  value = 0,
  onChange,
  size = 24,
  activeColor = "yellow",
  inactiveColor = "#bfbfbf",
}: AppRateProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive =
          hoverValue !== null ? starValue <= hoverValue : starValue <= value;

        return (
          <StarFilled
            key={starValue}
            style={{
              fontSize: size,
              color: isActive ? activeColor : inactiveColor,
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            className="hover:scale-110"
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange?.(starValue)}
          />
        );
      })}
    </div>
  );
};

export default AppRate;
