import {
  BackButton,
  FullscreenSpinner,
  GenericButton,
  LexOutput,
  useAuth,
} from '@acer-academy-learning/common-ui';
import {
  Teacher,
  getAnnouncementById,
} from '@acer-academy-learning/data-access';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LevelTag } from '../question-bank/LevelTag';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export const ViewAnnouncement: React.FC = () => {
  const { announcementId } = useParams();
  const {
    data: announcementData,
    isLoading,
    isSuccess,
  } = useQuery(['assignment', announcementId], () =>
    getAnnouncementById(announcementId ?? ''),
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth<Teacher>();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isSuccess && announcementData) {
    const announcement = announcementData.data;
    const navToEditAnnouncement = () => {
      navigate(`${location.pathname.slice(0, -37)}/edit/${announcement.id}`);
    };

    return (
      <>
        <BackButton className="mx-10" />
        <div className="px-10 pt-5">
          <div className="px-4 sm:px-0 flex flex-row justify-between">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">
              {announcement.title}
            </h3>
            {!!user && user.id === announcement.teacher.id && (
              <GenericButton
                onClick={navToEditAnnouncement}
                text="Edit Announcement"
                leftIcon={<PencilSquareIcon className="h-5 w-5 mr-2" />}
              />
            )}
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-200">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Message
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <LexOutput editorStateStr={announcement.message} />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Created By
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {announcement.teacher.firstName}{' '}
                  {announcement.teacher.lastName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Levels
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-row gap-3">
                    {announcement.targetLevels.map((level, index) => {
                      return (
                        <LevelTag key={index} index={index} levelEnum={level} />
                      );
                    })}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </>
    );
  }
};
