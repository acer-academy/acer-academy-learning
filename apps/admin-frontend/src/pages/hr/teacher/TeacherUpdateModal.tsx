import { TeacherData } from 'libs/data-access/src/lib/types/teacher';
import React from 'react';

export interface TeacherUpdateModalProps {
  teacherData: TeacherData;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isOpen: boolean;
}

export const TeacherUpdateModal: React.FC<TeacherUpdateModalProps> = (
  props: TeacherUpdateModalProps,
) => {
  const { teacherData, setIsModalOpen, isOpen } = props;
  return <div></div>;
};
