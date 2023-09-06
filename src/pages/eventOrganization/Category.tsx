import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import Header from '@/antdComponents/Header';
import { CategoriesApi } from '@/helpers/request';

interface Categoria {
  key?: string;
  name: string;
  eventosPorCategoria?: any; 
}

const Category: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoriaNombre, setCategoriaNombre] = useState<string>('');
  const [dataSource, setDataSource] = useState<Categoria[]>([]);

  // Función para mostrar/ocultar el modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Función para manejar el cambio en el campo de nombre
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriaNombre(e.target.value);
  };

  // Función para agregar una nueva categoría
  const agregarCategoria = async () => {
    // Validación de entrada aquí si es necesario

    // Agregar la nueva categoría al dataSource
    const nuevaCategoria: Categoria = {
      name: categoriaNombre,
    };

    // Actualizar el dataSource
    setDataSource([...dataSource, nuevaCategoria]);

    // Ocultar el modal
    toggleModal();

    await CategoriesApi.create(nuevaCategoria);
  };

  useEffect(() => {
    // Cargar categorías existentes al montar el componente
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response: any[] = await CategoriesApi.getAll(); 
      // Verificar si la API respondió correctamente
      if (response && Array.isArray(response)) {
        const categoriasArray: Categoria[] = response.map((categoria) => ({
          key: categoria.value,
          name: categoria.label,
          eventosPorCategoria: categoria.item,
        }));
        setDataSource(categoriasArray);
      } else {
        console.error('Error al obtener categorías:', response);
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const columns = [
    {
      title: 'Nombre categoría',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Eventos por categoría',
      dataIndex: 'eventosPorCategoria',
      key: 'eventosPorCategoria',
    },
  ];

  const renderTitle = () => (
    <Row wrap justify='end' gutter={[8, 8]}>
      <Col>
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={toggleModal}>
          {'Agregar'}
        </Button>
      </Col>
    </Row>
  );

  return (
    <>
      <Header title={'Categorías'} />
      <Table columns={columns} dataSource={dataSource} size='small' rowKey='key' title={renderTitle} />

      <Modal title='Agregar Categoría' visible={isModalVisible} onOk={agregarCategoria} onCancel={toggleModal}>
        <Input placeholder='Nombre de la categoría' value={categoriaNombre} onChange={handleNombreChange} />
      </Modal>
    </>
  );
};

export default Category;
