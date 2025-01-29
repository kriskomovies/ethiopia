import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useAppSelector } from '../../redux/store';
import {
  faBuilding,
  faCity,
  faFire,
  faCircleDollarToSlot,
  faCoins,
  faPlus,
  faFilter,
  faEye,
  faTrash,
  faEdit,
  faTriangleExclamation,
  faMoneyBill,
  faXmark,
  faCloudArrowUp,
  faHouse,
  faHandshake,
  faCalendar,
  faAngleDown,
  faAngleUp,
  faList,
  faFlag,
  faHourglassHalf,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';

const icons: Record<string, IconDefinition> = {
  faEye: faEye,
  faTrash: faTrash,
  faEdit: faEdit,
  faFilter: faFilter,
  faPlus: faPlus,
  faCoins: faCoins,
  faCircleDollarToSlot: faCircleDollarToSlot,
  faCity: faCity,
  faBuilding: faBuilding,
  faFire: faFire,
  faTriangleExclamation: faTriangleExclamation,
  faMoneyBill: faMoneyBill,
  faXmark: faXmark,
  faCloudArrowUp: faCloudArrowUp,
  faHouse: faHouse,
  faHandshake: faHandshake,
  faCalendar: faCalendar,
  faAngleDown: faAngleDown,
  faAngleUp: faAngleUp,
  faList: faList,
  faFlag: faFlag,
  faHourGlassHalf: faHourglassHalf,
  faWrench: faWrench,
};

interface IAwesomeIconsWrapper {
  name: string;
  isLast?: boolean;
  height?: number;
  width?: number;
  color?: string;
  hasHoverEffect?: boolean;
  isHovered?: boolean;
  className?: string;
  onClick?: () => void;
}
const AwesomeIconsWrapper = ({
  name,
  isLast = false,
  height = 16,
  width = 16,
  color,
  hasHoverEffect = true,
  className = '',
  onClick = () => {},
}: IAwesomeIconsWrapper): ReactNode => {
  const { selectedMainColor } = useAppSelector((state) => state.theme);

  const icon = icons[name];

  const iconStyles = (isLast: boolean): object => ({
    marginRight: isLast ? 0 : '10px',
    cursor: 'pointer',
    color: color || selectedMainColor,
    transition: 'transform 0.2s ease',
    height: height,
    width: width,
  });

  const onMouseEnter = (e: any): void => {
    if (!hasHoverEffect) {
      return;
    }

    e.currentTarget.style.transform = 'scale(1.2)';
  };

  const onMouseLeave = (e: any): void => {
    if (!hasHoverEffect) {
      return;
    }

    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <FontAwesomeIcon
      onClick={onClick}
      className={className}
      icon={icon!}
      style={iconStyles(isLast)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={(event) => event.stopPropagation()}
    />
  );
};

export default AwesomeIconsWrapper;
