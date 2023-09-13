/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import Header from '@/antdComponents/Header';
import { CategoriesApi } from '@/helpers/request';
import CategoryModal from './CategoryModal';
import { handleDeleteCategory } from '../tableColums/utils/deleteCategories';
import CardCategory from './CardCategory';
import CardGroupEvent from './CardGroup';

interface Categoria {
  key?: string;
  name: string;
  eventosPorCategoria?: any;
}

const Category: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoriaNombre, setCategoriaNombre] = useState<string>('');
  const [dataSource, setDataSource] = useState<Categoria[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const showEditModal = (record: Categoria) => {
    setSelectedCategoryId(record.key || '');
    setUpdatedCategoryName(record.name);
    setIsEditModalVisible(true);
  };
  // Función para mostrar/ocultar el modal
  const toggleModalGroup = () => {
    setIsGroupModalVisible(!isGroupModalVisible);
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const toggleEditModal = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };
  // Función para manejar el cambio en el campo de nombre
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriaNombre(e.target.value);
  };
  // Función para actualizar los datos de categorías
  const updateCategoriaData = async () => {
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
        console.error('Error updating category data:', response);
      }
    } catch (error) {
      console.error('Error updating category data:', error);
    }
  };

  // Función para agregar una nueva categoría
  const agregarCategoria = async () => {
    // Agregar la nueva categoría al dataSource
    const nuevaCategoria: Categoria = {
      name: categoriaNombre,
    };

    // Actualizar el dataSource
    setDataSource([...dataSource, nuevaCategoria]);

    // Ocultar el modal
    toggleModal();

    await CategoriesApi.create(nuevaCategoria);
    await updateCategoriaData();
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
          eventosPorCategoria: [],
        }));
        setDataSource(categoriasArray);
      } else {
        console.error('Error al obtener categorías:', response);
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const updateCategoria = async (id: string, newName: string) => {
    const updatedDataSources = dataSource.map((categoria) => {
      if (categoria.key === id) {
        return { ...categoria, name: newName };
      }
      return categoria;
    });
    setDataSource(updatedDataSources);
    try {
      await CategoriesApi.update(id, { name: newName });
      await updateCategoriaData();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  // Función para eliminar y actualizar data de una categoría
  const eliminarCategoria = async (id: string) => {
    try {
      await handleDeleteCategory(id);
      await updateCategoriaData();
    } catch (error) {
      console.error('Error al eliminar la categoría', error);
    }
  };
  return (
    <>
    <Header title={'Categorías y grupos'} />
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <CardCategory
            dataSource={dataSource}
            showEditModal={showEditModal}
            handleDeleteCategory={eliminarCategoria}
            toggleModal={toggleModal}
          />
        </Col>
        <Col span={12}>
          <CardGroupEvent dataSource={dataSource} showEditModalGroup={''} handleDeleteGroup={''} toggleModalGroup={toggleModalGroup} />
        </Col>
      </Row>
      <CategoryModal
        isVisible={isGroupModalVisible}
        onOk={toggleModalGroup}
        onCancel={toggleModalGroup}
        title='Agregar Grupo'
        categoryValue={categoriaNombre}
        handleCategoryChange={toggleModalGroup}
        namePlaceHolder='Nombre del grupo'
      />
      <CategoryModal
        isVisible={isModalVisible}
        onOk={agregarCategoria}
        onCancel={toggleModal}
        title='Agregar Categoría'
        categoryValue={categoriaNombre}
        handleCategoryChange={handleNombreChange}
        namePlaceHolder='Nombre de la categoría'
      />
      <CategoryModal
        isVisible={isEditModalVisible}
        onOk={() => {
          updateCategoria(selectedCategoryId, updatedCategoryName);
          toggleEditModal();
        }}
        onCancel={toggleEditModal}
        title='Editar Categoría'
        categoryValue={updatedCategoryName}
        handleCategoryChange={(e) => setUpdatedCategoryName(e.target.value)}
        namePlaceHolder='Nombre de la categoría'
      />
    </>
  );
};

export default Category;
