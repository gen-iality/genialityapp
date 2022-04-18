export default function TableAction({ ...props }) {
  const { id, object, saveItem, editItem, removeNew, removeItem, discardChanges } = props;
  return (
    <td>
      {id === object._id ? (
        <button data-tooltip='Guardar'>
          <span
            className='icon'
            onClick={() => {
              saveItem(object);
            }}>
            <i className='fas fa-save' />
          </span>
        </button>
      ) : (
        <button style={{ marginLeft: 20, marginRight: 20 }} data-tooltip='Editar'>
          <span className='icon' onClick={() => editItem(object)}>
            <i className='fas fa-edit' />
          </span>
        </button>
      )}
      {object._id === 'new' ? (
        <button data-tooltip='Eliminar'>
          <span className='icon' onClick={removeNew}>
            <i className='fas fa-times' />
          </span>
        </button>
      ) : (
        <button data-tooltip='Eliminar'>
          <span
            className='icon'
            onClick={() => {
              removeItem(object._id);
            }}>
            <i className='far fa-trash-alt' />
          </span>
        </button>
      )}
      {id === object._id && id !== 'new' && (
        <button data-tooltip='Cancelar'>
          <span className='icon has-text-grey' onClick={discardChanges}>
            <i className='fas fa-times' />
          </span>
        </button>
      )}
    </td>
  );
}
