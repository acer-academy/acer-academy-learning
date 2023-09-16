import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { createElement, useMemo } from 'react';
import {
  UserOutlined,
  PaperClipOutlined,
  CalculatorOutlined,
  AreaChartOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  BellOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Image, type ImageProps } from 'antd';

export enum PrimaryLayoutTypeEnum {
  Student = 'Student',
  Teacher = 'Teacher',
}

export enum Booking {
  ViewClasses = 'View Classes',
  BookClasses = 'Book Classes',
  BuyCredits = 'Buy Credits',
}

export enum Subjects {
  Assignments = 'Assignments',
  Quizzes = 'Quizzes',
  Analytics = 'Analytics',
  Recordings = 'Recordings',
  ZoomLink = 'Zoom Link',
}

export enum StudentTopNavEnum {
  Dashboard = 'DASHBOARD',
  Subjects = 'SUBJECTS',
  Booking = 'BOOKING',
  Rewards = 'REWARDS',
  Account = 'ACCOUNT',
}

export enum StudentSubjectsEnum {
  Assignments = 'Assignments',
  Quizzes = 'Quizzes',
  Analytics = 'Analytics',
  Recordings = 'Recordings',
  ZoomLink = 'Zoom Link',
}

export enum StudentBookingEnum {
  ViewClasses = 'View Classes',
  BookClasses = 'Book Classes',
  BuyCredits = 'Buy Credits',
}

export enum StudentAccountEnum {
  Profile = 'Profile',
  Notifications = 'Notifications',
  Settings = 'Settings',
}

// Have to hardcode it like this for now
// @TODO: Add for Teacher
const SideBarMenuItems: {
  [key in StudentTopNavEnum | TeacherTopNavEnum]: ItemType<MenuItemType>[];
} = {
  [StudentTopNavEnum.Dashboard]: [],
  [StudentTopNavEnum.Subjects]: [
    {
      label: 'Assignments',
      key: 'Assignments',
      icon: createElement(PaperClipOutlined),
    },
    {
      label: 'Quizzes',
      key: 'Quizzes',
      icon: createElement(CalculatorOutlined),
    },
    {
      label: 'Analytics',
      key: 'Analytics',
      icon: createElement(AreaChartOutlined),
    },
    {
      label: 'Recordings',
      key: 'Recordings',
      icon: createElement(VideoCameraOutlined),
    },
    {
      label: 'Zoom Link',
      key: 'Zoom Link',
      icon: createElement(LinkOutlined),
    },
  ] as ItemType<MenuItemType>[],
  [StudentTopNavEnum.Booking]: [
    {
      label: 'View Classes',
      key: 'View Classes',
      url: '/view-classes',
      icon: createElement(AppstoreOutlined),
    },
    {
      label: 'Book Classes',
      key: 'Book Classes',
      url: '/book-classes',
      icon: createElement(CalendarOutlined),
    },
    {
      label: 'Buy Credits',
      key: '/buy-credits',
      icon: createElement(ShoppingCartOutlined),
    },
  ] as ItemType<MenuItemType>[],
  [StudentTopNavEnum.Rewards]: [],
  [StudentTopNavEnum.Account]: [
    {
      label: 'Profile',
      key: '/profile',
      icon: createElement(UserOutlined),
    },
    {
      label: 'Notifications',
      key: '/notificatons',
      icon: createElement(BellOutlined),
    },
    {
      label: 'Settings',
      key: '/settings',
      icon: createElement(SettingOutlined),
    },
  ] as ItemType<MenuItemType>[],
};

// @TODO: Add for Teacher
export enum TeacherTopNavEnum {}

/**
 * Utility function to get menu item array to populate for account
 */
export const useGetAccountMenuItem = (
  name: string,
  imageUrl?: string,
): ItemType<MenuItemType>[] => {
  const accountMenuItem: ItemType<MenuItemType>[] = useMemo<
    ItemType<MenuItemType>[]
  >(() => {
    const IMAGE_PROPS: ImageProps = {
      width: 24,
      height: 24,
      src: imageUrl,
    };
    const menuItem: ItemType<MenuItemType>[] = [
      {
        label: name,
        key: name,
        icon:
          (imageUrl && createElement(Image, IMAGE_PROPS)) ||
          createElement(UserOutlined, {
            style: {
              fontSize: '1.5rem',
            },
          }),
        children: SideBarMenuItems[StudentTopNavEnum.Account],
      },
    ];

    return menuItem;
  }, [name, imageUrl]);

  return accountMenuItem;
};

export const convertStringToKebabCase = (str: string) => {
  return str
    .split(' ')
    .map((currStr) => currStr.toLocaleLowerCase())
    .join('-');
};

export const getPrimaryLayoutSideBarMenuItems = (
  category: StudentTopNavEnum | TeacherTopNavEnum,
) => SideBarMenuItems[category];
