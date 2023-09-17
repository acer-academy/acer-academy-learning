import { createElement } from 'react';
import {
  ANALYTICS,
  ASSIGNMENTS,
  BOOK_CLASSES,
  BUY_CREDITS,
  NOTIFICATIONS,
  PROFILE,
  QUIZZES,
  RECORDINGS,
  SETTINGS,
  VIEW_CLASSES,
  ZOOM_LINK,
} from '../constants/routes';
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

export const getIconFor = (menuItem: string) => {
  switch (menuItem) {
    case PROFILE:
      return createElement(UserOutlined);
    case NOTIFICATIONS:
      return createElement(BellOutlined);
    case SETTINGS:
      return createElement(SettingOutlined);
    case ASSIGNMENTS:
      return createElement(PaperClipOutlined);
    case QUIZZES:
      return createElement(CalculatorOutlined);
    case ANALYTICS:
      return createElement(AreaChartOutlined);
    case RECORDINGS:
      return createElement(VideoCameraOutlined);
    case ZOOM_LINK:
      return createElement(LinkOutlined);
    case VIEW_CLASSES:
      return createElement(AppstoreOutlined);
    case BOOK_CLASSES:
      return createElement(CalendarOutlined);
    case BUY_CREDITS:
      return createElement(ShoppingCartOutlined);
    default:
      return createElement(AppstoreOutlined);
  }
};
