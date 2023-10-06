import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { getAllFaqTopics } from '@acer-academy-learning/data-access';
import { FaqTopicData } from 'libs/data-access/src/lib/types/faqTopic';
import { useEffect, useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';

export const FaqPage: React.FC = () => {
  const [faqTopics, setFaqTopics] = useState<FaqTopicData[]>([]);

  const { displayToast, ToastType } = useToast();

  const getFaqTopics = async () => {
    try {
      const response = await getAllFaqTopics();
      const allFaqTopics: FaqTopicData[] = response.data;
      setFaqTopics(allFaqTopics);
    } catch (error) {
      displayToast(
        'FAQ topics could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    // Call the getFaqTopics function when the component is mounted
    getFaqTopics();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-3xl font-bold leading-10 text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqTopics.map((topic) => (
              <Disclosure as="div" key={topic.id} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-2xl font-semibold leading-7">
                          {topic.title}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pl-6">
                      {topic.faqArticles.map((article) => (
                        <Disclosure as="div" key={article.id} className="pt-6">
                          {({ open }) => (
                            <>
                              <dt>
                                <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                  <span className="text-base font-semibold leading-7">
                                    {article.title}
                                  </span>
                                  <span className="ml-6 flex h-7 items-center">
                                    {open ? (
                                      <MinusSmallIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <PlusSmallIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </dt>
                              <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                {article.imageUrl && (
                                  <img
                                    src={article.imageUrl}
                                    alt={`Image for ${article.title}`}
                                    className="max-w-sm h-auto mb-4 mt-4"
                                  />
                                )}
                                <p className="text-base leading-7 text-gray-600">
                                  {article.body}
                                </p>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
