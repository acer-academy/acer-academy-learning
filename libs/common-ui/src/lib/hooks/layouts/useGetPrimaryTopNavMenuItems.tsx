import { useMemo } from 'react';
import {
  PrimaryLayoutTypeEnum,
  StudentTopNavEnum,
  convertStringToKebabCase,
} from '../../layout/utils';
import { CustomMenuItemType } from '../../layout/types';
import { Link } from 'react-router-dom';

export const useGetPrimaryTopNavMenuItems = (type: PrimaryLayoutTypeEnum) => {
  const memoedMenuItems: CustomMenuItemType[] = useMemo(() => {
    switch (type) {
      case PrimaryLayoutTypeEnum.Teacher:
        //@TODO: Add for Teacher
        return [];
      default:
        // Student
        return Object.values(StudentTopNavEnum)
          .filter((category) => category !== StudentTopNavEnum.Account)
          .map((category) => ({
            label: (
              <Link to={convertStringToKebabCase(category)}>{category}</Link>
            ),
            key: category,
          })) as CustomMenuItemType[];
    }
  }, [type]);
  return memoedMenuItems;
};
