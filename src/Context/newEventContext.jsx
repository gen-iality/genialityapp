import React, { createContext, useContext, useEffect, useState } from 'react';
import moment from 'moment';

export const cNewEventContext = createContext();

export const NewEventProvider = ({ children }) => {
  const [addDescription, setAddDescription] = useState(false);
  const [typeTransmission, setTypeTransmission] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const fechaActual = new Date();
  const fechaInicialFin = new Date(new Date().setHours(fechaActual.getHours() + 1));
  const [selectedHours, setSelectedHours] = useState({ from: fechaActual, at: fechaInicialFin });
  const [dateEvent, setDateEvent] = useState();
  const [selectedDateEvent, setSelectedDateEvent] = useState();
  const [valueInputs, setValueInputs] = useState({});
  const [errorInputs, setErrorInputs] = useState([]);
  const [imageEvents,setImageEvents]=useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };
  const visibilityDescription = (value) => {
    setAddDescription(value);
    setValueInputs({...valueInputs,['description']:''})
  };

  const saveImageEvent=(image,index)=>{      
    setImageEvents({...imageEvents,[index]:image})
  }

  const changeSelectDay = (day) => {
    setSelectedDay(day);
  };
  const changeSelectHours = (hour) => {
    setSelectedHours(hour);
  };

  const changetypeTransmision = (type) => {
    setTypeTransmission(type);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedDateEvent({
      from: moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(selectedHours.from).format('HH:mm'),
      at: moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(selectedHours.at).format('HH:mm'),
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };
  const handleInput = (event, name) => {
    let listerrors = errorInputs.filter((err) => err.name !== name);
    setValueInputs({ ...valueInputs, [name]: event.target.value });
    if (name == 'name') {
      if (event.target.value.length >= 4) {
        listerrors.push({ name: 'name', value: false });
      } else if (event.target.value.length <= 3) {
        listerrors.push({ name: 'name', value: true });
      }
    }
    if (name == 'description' && addDescription) {
      if (event.target.value.length >= 10) {
        listerrors.push({ name: 'description', value: false });
      } else if (event.target.value.length <= 9) {
        listerrors.push({ name: 'description', value: true });
      }
    }
    setErrorInputs(listerrors);
  };

  const containsError = (field) => {
    let errorField = errorInputs.filter((error) => error.name == field);
    if (errorField.length > 0 && errorField[0].value) {
      return true;
    }
    return false;
  };

  const validateField = (validatorsInput) => {
    let listerrors = [];

    validatorsInput.map((validator) => {
      if (validator) {
        if (
          (valueInputs.length == 0 && validator.required) ||
          (!valueInputs[validator.name] && validator.required) ||
          (valueInputs[validator.name]?.length < validator.length && validator.required)
        ) {
          listerrors.push({ name: validator.name, value: true });
        }
      }
    });
    setErrorInputs(listerrors);
    if (listerrors.length > 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setSelectedDateEvent({
      from: moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(selectedHours.from).format('HH:mm'),
      at: moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(selectedHours.at).format('HH:mm'),
    });
  }, []);

  useEffect(() => {
    if (selectedDateEvent) {
      setDateEvent(selectedDateEvent.from + '     -     ' + selectedDateEvent.at);
    }
  }, [selectedDateEvent]);
  return (
    <cNewEventContext.Provider
      value={{
        addDescription,
        typeTransmission,
        isModalVisible,
        selectedDay,
        selectedHours,
        dateEvent,
        selectedDateEvent,
        showModal,
        handleOk,
        handleCancel,
        handleDayClick,
        visibilityDescription,
        changetypeTransmision,
        changeSelectHours,
        changeSelectDay,
        handleInput,
        valueInputs,
        errorInputs,
        containsError,
        validateField,
        imageEvents,
        saveImageEvent

      }}>
      {children}
    </cNewEventContext.Provider>
  );
};

export const useContextNewEvent = () => {
  let context = useContext(cNewEventContext);
  if (!context) {
    throw new Error('useContextNewEvent debe estar dentro del proveedor');
  }
  return context;
};
export default cNewEventContext;
