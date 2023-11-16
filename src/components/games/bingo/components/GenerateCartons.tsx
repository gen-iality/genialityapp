import { Button, Form, InputNumber, Modal, ModalProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { createBingoCartons } from '../services/bingo-cartons.service';

interface Props extends ModalProps {
  fetchBingoCartons: () => Promise<void>;
  closeModal: () => void;
  bingoId: string;
}
export const GenerateCartons = ({ fetchBingoCartons, bingoId, closeModal, ...modalProps }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <Modal title={'Generar cartones'} {...modalProps} footer={null}>
      <Form
        layout='vertical'
        onFinish={async (value: { cartonNumber: number }) => {
          setIsGenerating(true);
          const { ok } = await createBingoCartons(bingoId, value.cartonNumber);
          if (ok) fetchBingoCartons();
          setIsGenerating(false);
          closeModal();
        }}>
        <Form.Item
          label='Numero de cartones'
          name='cartonNumber'
          rules={[
            { type: 'number', min: 1, message: 'Puede generar minimo un carton' },
            {
              required: true,
              message: 'El numero de cartones es obligatorio',
            },
          ]}>
          <InputNumber ref={inputRef} size='large' style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' type='primary' loading={isGenerating}>
            Generar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
