import { Button, List, Row, Space, Typography } from 'antd';
import { Bingo } from '../../interfaces/bingo';
import { useGetBingoCartons } from '../../hooks';
import { useModalLogic } from '@/hooks/useModalLogic';
import { GenerateCartons } from '../GenerateCartons';
import { CartonItem } from './CartonItem';
import { useRef } from 'react';
import PrintCardBoard from '../PrintCardBoard';
import RenderBingoCarton from './RenderBingoCarton';
import {
  deleteBingoCartonList,
  handledErrorBingoCarton,
  handledSuccesBingoCarton,
} from '../../services/bingo-cartons.service';
import { confirmDeleteSync } from '@/components/ModalConfirm/confirmDelete';

interface Props {
  bingo: Bingo;
}

const NO_CARTONS = 0;
export const CartonsList = ({ bingo }: Props) => {
  const bingoCardRef = useRef();
  const { bingoCartons, isLoadingBingoCartons, pagination, fetchData: fetchBingoCartons } = useGetBingoCartons(
    bingo._id,
    true
  );
  const { isOpenModal, closeModal, openModal } = useModalLogic();

  const onDeleteAllCartons = async () => {
    confirmDeleteSync({
      descriptionConfirm: `Esto eliminara todos los cartones (${pagination.total}) que existen actualmente`,
      onOk: async () => {
        const cartonsId = bingoCartons.map((carton) => carton._id);
        const { error } = await deleteBingoCartonList(bingo._id, cartonsId);
        if (!error) {
          handledSuccesBingoCarton('delete', { plural: true });
          fetchBingoCartons();
        } else {
          handledErrorBingoCarton('delete');
        }
      },
      titleConfirm: 'Eliminar todos los cartones',
    });
  };
  return (
    <>
      <Row justify='space-between'>
        <Typography.Title level={5}>Lista de cartones</Typography.Title>
        <Space wrap>
          <Button type='primary' style={{ minWidth: '250px' }} onClick={openModal}>
            Generar cartones
          </Button>

          {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
            <PrintCardBoard
              bingoCardRef={bingoCardRef}
              cardboardCode={`ListCartons_Page_${pagination.current}`}
              listCartons
            />
          )}
          <Button
            disabled={pagination.total === NO_CARTONS}
            danger
            style={{ minWidth: '250px' }}
            onClick={onDeleteAllCartons}>
            Eliminar todos los cartones
          </Button>
        </Space>

        {isOpenModal && (
          <GenerateCartons
            bingoId={bingo._id}
            visible={isOpenModal}
            onCancel={closeModal}
            fetchBingoCartons={fetchBingoCartons}
            closeModal={closeModal}
          />
        )}
      </Row>
      <List
        loading={isLoadingBingoCartons}
        dataSource={bingoCartons}
        className='desplazar'
        style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
        pagination={{ ...pagination, position: 'both', showTotal: (total) => <p>Total: {total}</p> }}
        renderItem={(bingoCartonItem) => {
          return <CartonItem bingoCartonItem={bingoCartonItem} bingo={bingo} fetchBingoCartons={fetchBingoCartons} />;
        }}
      />

      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <RenderBingoCarton
          bingoCardRef={bingoCardRef}
          bingoUsers={bingoCartons.map((bingoUser: any) => {
            return {
              code: bingoUser?.bingo_card?.code,
              email: bingoUser?.properties?.email,
              id: bingoUser?.bingo_card?.event_user_id,
              names: bingoUser?.properties?.names,
              values: bingoUser?.values_bingo_card,
            };
          })}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
        />
      )}
    </>
  );
};
