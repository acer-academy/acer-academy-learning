import { FullscreenSpinner, useAuth } from '@acer-academy-learning/common-ui';
import {
  Teacher,
  getAnnouncementById,
} from '@acer-academy-learning/data-access';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { EditAnnouncement } from './EditAnnouncement';

export const EditAnnouncementWrapper: React.FC = () => {
  const { announcementId } = useParams();
  const {
    data: announcementData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', announcementId], () =>
    getAnnouncementById(announcementId ?? ''),
  );
  const { user } = useAuth<Teacher>();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && announcementData) {
    const announcement = announcementData.data;
    if (!!user && user.id === announcement.teacher.id) {
      return <EditAnnouncement announcement={announcement} />;
    } else {
      return (
        <div className="flex justify-center text-red-500 font-bold">
          You do not have access to edit this announcement.
        </div>
      );
    }
  }
};
