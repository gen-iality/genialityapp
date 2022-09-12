import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Select, Spin } from 'antd';
import { DocumentsApi } from '@/helpers/request';
import SelectOptionType from '../types/SelectOptionType';

import Document from '@components/documents/Document';

export interface AgendaDocumentForm {
  eventId: string,
  selectedDocuments: SelectOptionType[],
  onSelectedDocuments?: (changed: SelectOptionType[]) => void,
  matchUrl?: string,
};

function AgendaDocumentForm(props: AgendaDocumentForm) {
  const {
    eventId,
    selectedDocuments,
    onSelectedDocuments,
    matchUrl,
  } = props;

  const [allNameDocuments, setAllNameDocuments] = useState<SelectOptionType[]>([]);
  const [wasLoaded, setWasLoaded] = useState(true);

  const loadAllDocument = useCallback(async () => {
    setWasLoaded(true);
    const documents = await DocumentsApi.byEvent(eventId);

    // Load document names
    const newNameDocuments = documents.map((document: { _id: string; title: string }) => ({
      ...document,
      value: document._id,
      label: document.title,
    }));
    setAllNameDocuments(newNameDocuments);
    setWasLoaded(false);
  }, []);

  // Loads document from API using the current event id.
  useEffect(() => {
    loadAllDocument().then();
  }, []);

  return (
    <>
    <h3>Seleccione o cargue un documento</h3>
    {wasLoaded && <Spin/>}
    <Select
      showArrow
      id='nameDocuments'
      mode='multiple'
      options={allNameDocuments}
      onChange={onSelectedDocuments}
      defaultValue={selectedDocuments}
    />
    <br/>
    <Document
      simpleMode
      event={{ _id: eventId }} // Awful, but who are we
      matchUrl={matchUrl}
      location={{location: { state: {edit: false} }}} // Awful, but who are we
      cbUploaded={() => {
        loadAllDocument().then();
        console.debug('calls cbUploaded');
      }}
    />
    </>
  );
}

export default AgendaDocumentForm;
