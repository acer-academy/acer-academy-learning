import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  getAllCentres,
  CreateAnnouncementType,
} from '@acer-academy-learning/data-access';
import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
  useToast,
} from '@acer-academy-learning/common-ui';
import { ErrorMessage } from '@hookform/error-message';
import { CentreData } from 'libs/data-access/src/lib/types/centre';

type SelectedItem = {
  label: string;
  value: string;
};

export const AnnonuncementCentresField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAnnouncementType>();

  const { displayToast, ToastType } = useToast();
  const [centres, setCentres] = useState<CentreData[]>([]);
  const [selectedCentres, setSelectedCentres] = useState<string[]>([]);
  const [selectedCentreNames, setSelectedCentreNames] = useState<string[]>([]);
  const [selectedCentresSet, setSelectedCentresSet] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCentreNamesSet, setSelectedCentreNamesSet] = useState<
    Set<string>
  >(new Set());

  const fetchCentres = async () => {
    try {
      const response = await getAllCentres();
      const allCentres: CentreData[] = response.data;
      setCentres(allCentres);
    } catch (error) {
      displayToast(
        'Centres could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const updateSelectedCentres = useCallback((selectedItems: SelectedItem[]) => {
    const selectedCentreIdsSet = new Set<string>();
    const selectedCentreNamesSet = new Set<string>();

    selectedItems.forEach((item) => {
      selectedCentreIdsSet.add(item.value);
      selectedCentreNamesSet.add(item.label);
    });

    setSelectedCentresSet(selectedCentreIdsSet);
    setSelectedCentreNamesSet(selectedCentreNamesSet);

    const selectedCentreIds = Array.from(selectedCentreIdsSet);
    setSelectedCentres(selectedCentreIds);

    const selectedCentreNames = Array.from(selectedCentreNamesSet);
    setSelectedCentreNames(selectedCentreNames);
  }, []);

  const filteredOptions = centres.filter(
    (centre) => !selectedCentresSet.has(centre.id),
  );

  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Centres(s):
      </h3>
      <Controller
        control={control}
        name={'targetCentres'}
        render={({ field: { onChange, value } }) => (
          <>
            <GenericBadges
              onChange={onChange}
              badges={selectedCentreNames}
              getDisplayValue={(badge) => screamingSnakeToTitleCase(badge)}
              allowRemove
            />
            <ErrorMessage
              errors={errors}
              name="targetCentres"
              render={({ message }) => <ErrorField message={message} />}
            />
            <GenericComboBox
              options={filteredOptions.map((centre) => ({
                label: centre.name,
                value: centre.id,
              }))}
              onChange={(selectedItems) => {
                updateSelectedCentres(selectedItems);
                onChange(selectedItems.map((item) => item.value));
              }}
              selected={selectedCentres.map((id) => ({
                label: centres.find((centre) => centre.id === id)?.name || '',
                value: id,
              }))}
              displayValue={(centre) => screamingSnakeToTitleCase(centre.label)}
            />
          </>
        )}
      />
    </>
  );
};
