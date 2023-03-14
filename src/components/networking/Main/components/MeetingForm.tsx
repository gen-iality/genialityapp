import React, { useState } from 'react';

export default function MeetingForm() {
  const [modal, setModal] = useState(true);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  return <div></div>;
}
