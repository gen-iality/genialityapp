import * as React from 'react';
import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { DocumentsApi } from '@/helpers/request';
import SelectOptionType from '../types/SelectOptionType';

export interface AgendaDocumentForm {
  eventId: string,
  selectedDocuments: SelectOptionType[],
  onSelectedDocuments?: (changed: SelectOptionType[]) => void,
};

function AgendaDocumentForm(props: AgendaDocumentForm) {
  const {
    eventId,
    selectedDocuments,
    onSelectedDocuments,
  } = props;

  const [allNameDocuments, setAllNameDocuments] = useState<SelectOptionType[]>([]);

  // Loads document from API using the current event id.
  useEffect(() => {
      const loading = async () => {
        const documents = await DocumentsApi.byEvent(eventId);

        // Load document names
        const newNameDocuments = documents.map((document: { _id: string; title: string }) => ({
          ...document,
          value: document._id,
          label: document.title,
        }));
        setAllNameDocuments(newNameDocuments);
      }

      loading().then();
  }, []);

  return (
    <>
    <Select
      showArrow
      id='nameDocuments'
      mode='multiple'
      options={allNameDocuments}
      onChange={onSelectedDocuments}
      defaultValue={selectedDocuments}
    />
    </>
  );
}

export default AgendaDocumentForm;
