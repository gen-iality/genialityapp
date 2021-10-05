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
  const [valueInputs, setValueInputs] = useState([]);
  const [errorInputs, setErrorInputs] = useState([]);
  let listerror=[];
  const showModal = () => {
    setIsModalVisible(true);
  };
  const visibilityDescription = (value) => {
    setAddDescription(value);
  };

  const setError = ({ name, value }, list) => {
    console.log("FIELD==>",name,errorInputs)
    console.log("LISTA==>",listerror)
    listerror = listerror.filter((error) => error?.name != name);
    console.log("LIST ERROR ACA==>",listerror,{ name: name, value: value },errorInputs)
    listerror.push({ name: name, value: value })
    console.log("DESPUES==>",listerror)
    setErrorInputs(listerror);
    console.log("INPUTS ERROR==>",listerror)
  };

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
    setValueInputs([{ [name]: event.target.value }]);
    if (name == 'name') {
      if (event.target.value.length >= 4) {      
        
          setError({ name: 'name', value: false});
      }else if(event.target.value.length < 3){
        setError({ name: 'name', value: true});
      }
    }
    if(name=='description' && addDescription){
      if (event.target.value.length >= 10) {      
      
          setError({ name: 'description', value: false});
      }else if(event.target.value.length <= 9){
        setError({ name: 'description', value: true});
      }
    }
  };

  const containsError=(field)=>{
     let errorField= errorInputs.filter((error)=>error.name==field);     
     if(errorField.length>0 && errorField[0].value){      
       return true;
     }
     return false;
  }

  const validateField=async(field,required, length)=>{
    console.log("INPUTS==>",valueInputs,field)
    let inputs = valueInputs?valueInputs?.filter((input) => input.name == field):[];
    console.log("INPUT FILTER==>",inputs)
    if(valueInputs && inputs.length>0){
      if(valueInputs[field]?.length<length && required){
        console.log("ERROR IF1")
        await setError({ name: field, value: true});
        return true;
        }
    }else if(inputs.length==0 && required){
      console.log("ERROR IF2")
      await setError({ name: field, value: true});
      return true;
    }else{
      await setError({ name: field, value: false});
      return false;
    }
  
 }

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
        setError,
        errorInputs,
        containsError,
        validateField
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
