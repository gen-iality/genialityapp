import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';

export default function ListadoJuegos(props) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    let gameId = '0biWfCwWbUGhbZmfhkvu';
    firestore.collection('juegos/' + gameId + '/puntajes/').onSnapshot(function(querySnapshot) {
      var puntajes = [];
      querySnapshot.forEach(function(doc) {
        puntajes.push(doc.data());
      });
      setRanking(puntajes);
    });
  }, []);

  return (
    <>
      <ul>
        <li onClick={() => props.changeContentDisplayed('game')}>Juego 1</li>
        <li onClick={() => props.changeContentDisplayed('conference')}>Conferencia</li>
      </ul>
      <h2>Ranking</h2>
      <ul>
        {ranking.map((item, key) => (
          <li key={'item' + key}>{item.puntaje}</li>
        ))}
      </ul>
    </>
  );
}
