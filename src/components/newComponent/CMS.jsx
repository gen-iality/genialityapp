import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

const CMS = ( props ) => {
  const { title, titleTooltip, addUrl, columns, loading, list, key, pagination, actions, editPath, remove} = props;
  //API que sería a cual servicio llamar, para hacer los submit y remove y cualquier otra acción
  return (
    <div>
      <Header
        title={title}
        titleTooltip={titleTooltip}
        addUrl={addUrl}
      />

      <Table 
        header={columns}
        loading={loading}
        list={list}
        key={key}
        pagination={pagination}
        actions={actions}
        editPath={editPath}
        remove={remove}
      />
    </div>
  )
}

export default CMS;