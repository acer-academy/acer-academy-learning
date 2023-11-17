import { LexOutput, useAuth, useToast } from '@acer-academy-learning/common-ui';
import {
  AnnouncementData,
  getAllAnnouncements,
} from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export const StudentDashboard: React.FC = () => {
  const { user: authUser } = useAuth<Student>();

  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const { displayToast, ToastType } = useToast();

  const fetchAnnouncements = async () => {
    try {
      const response = await getAllAnnouncements();
      const announcements = response.data;
      setAnnouncements(announcements);
    } catch (error) {
      displayToast(
        'Announcements could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="h-full">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold tracking-tight mb-8">
          Announcements
        </span>
      </div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {announcements.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                      >
                        Announcement
                      </th>
                      <th
                        scope="col"
                        className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {announcements.map((announcement) => (
                      <tr key={announcement.id}>
                        <td className="py-4 pl-3.5 pr-12 text-xs font-medium text-gray-900">
                          <div>
                            <span className="font-bold text-lg">
                              {announcement.title}
                            </span>
                            <span>
                              <LexOutput
                                editorStateStr={announcement.message}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                          {moment(announcement.createdAt).format('D MMMM YYYY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No announcements has been created yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
