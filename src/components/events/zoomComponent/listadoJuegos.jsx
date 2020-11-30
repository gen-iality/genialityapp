import React from 'react';

export default function ListadoJuegos(props) {
  return (
    <ul>
      <li onClick={() => props.changeContentDisplayed('game')}>Juego 1</li>
      <li onClick={() => props.changeContentDisplayed('game2')}>Juego 2</li>
      <li onClick={() => props.changeContentDisplayed('conference')}>Conferencia</li>
    </ul>
  );
}
