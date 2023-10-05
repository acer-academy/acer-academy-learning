import { useAuth } from '@acer-academy-learning/common-ui';
import {
  getAvailableCredits,
  getCurrentTerms,
} from '@acer-academy-learning/data-access';
import { Student } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUY_CREDITS } from '../libs/routes';

export default function CreditsBar() {
  const { user: authUser } = useAuth<Student>();
  const studentId = authUser?.id;

  const [currentTermId, setCurrentTermId] = useState('');
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleTopUp = () => {
    navigate(BUY_CREDITS);
  };

  async function fetchCurrentTerm() {
    const results = await getCurrentTerms();
    const term = results.data[0];
    setCurrentTermId(term.id);
  }

  async function fetchCredits() {
    if (currentTermId && studentId) {
      const retrievedCredits = await getAvailableCredits(
        currentTermId,
        studentId,
      );
      setCredits(retrievedCredits.data);
      setIsLoading(false); // Set loading to false after fetching credits
    }
  }

  useEffect(() => {
    fetchCurrentTerm();
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [currentTermId, studentId]);

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex justify-end">
        <div className="flex justify-end items-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {credits <= 0 && (
                <div className="group relative flex items-center mr-4">
                  <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={handleTopUp}>Top Up Credits</button>
                  </div>
                  <button className="relative z-10">
                    <span className="bg-red-600 w-4 h-4 rounded-full absolute left-0 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs cursor-pointer">
                      !
                    </span>
                  </button>
                </div>
              )}
              <p className="text-sm leading-6 text-gray-900">
                <strong className="font-semibold">Credits</strong>
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                {credits}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
