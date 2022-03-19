import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Space, Typography } from 'antd';
import Logout from '@2fd/ant-design-icons/lib/Logout';
import ContentSave from '@2fd/ant-design-icons/lib/ContentSave';

const { Title } = Typography;

interface RouterPromptPropsOptions {
  /** indicates when the modal should be displayed */
  when: boolean;
  /** custom text for modal title */
  title?: string;
  /** custom text for modal body */
  description?: string;
  /** custom text for ok button */
  okText?: string;
  /** custom text for ok save button */
  okSaveText?: string;
  /** custom text for cancel button */
  cancelText?: string;
  /** true with which it is validated if the route can be abandoned by clicking on the ok button */
  onOK: () => boolean;
  /** submit function, saveChanges by clicking on the ok button */
  onOKSave?: any;
  /** false with which it is validated if we stay in the current route by clicking the cancel button */
  onCancel: () => boolean;
  /** indicates if the save and exit button should be shown */
  save: boolean;
  /** if it comes, it is to be able to know if the save button place it as "submit" */
  form: boolean;
}

/**
 * This function is a React hook that returns a modal that prompts the user to confirm exiting the current view if no changes have been saved
 * @property {boolean} when
 * @property {string} title
 * @property {string} description - custom text for modal body
 * @property {string} okText - custom text for ok button
 * @property {string} cancelText - custom text for cancel button
 * @callback onOK
 * @type {onOK} - true with which it is validated if the route can be abandoned by clicking on the ok button
 * @function onOKSave
 * @property {onOKSave} - save by clicking on the okSaveText button
 * @callback  onCancel
 * @type {onCancel} - false with which it is validated if we stay in the current route by clicking the cancel button
 * @property {boolean} save - indicates if the save and exit button should be shown
 * @property {boolean} form - if it comes, it is to be able to know if the save button place it as "submit"
 * @returns A modal that prompts the user to confirm the route change if they have not saved changes.
 */

export function RouterPrompt({
  when,
  title,
  description,
  okText,
  okSaveText,
  cancelText,
  onOK,
  onOKSave,
  onCancel,
  save,
  form = false,
}: RouterPromptPropsOptions): JSX.Element | null {
  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [loadingAndDisablingButtons, setLoadingAndDisablingButtons] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setShowPrompt(true);
        return 'true';
      });
    } else {
      history.block(() => { });
    }

    return () => {
      history.block(() => { });
    };
  }, [history, when]);

  const handleOK = useCallback(
    async (mustSave) => {
      if (onOK) {
        if (mustSave) {
          setLoadingAndDisablingButtons(true);
          onOKSave && (await onOKSave(false));
        }

        const canRoute = await Promise.resolve(onOK());
        if (canRoute) {
          history.block(() => { });
          history.push(currentPath);
        }
      }
    },
    [currentPath, history, onOK]
  );

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => { });
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);

  return showPrompt ? (
    <Modal
      visible={showPrompt}
      onCancel={handleCancel}
      closable={true}
      centered
      footer={[
        save && (
          <Button
            key='link'
            type='primary'
            htmlType={form ? 'submit' : 'button'}
            onClick={() => handleOK(true)}
            icon={<ContentSave />}
            loading={loadingAndDisablingButtons}
            disabled={loadingAndDisablingButtons}
          >
            {okSaveText ? okSaveText : ''}
          </Button>
        ),
        <Button
          key='goBack'
          onClick={() => handleOK(false)}
          icon={<Logout />}
          disabled={loadingAndDisablingButtons}>
          {okText ? okText : ''}
        </Button>,
        <Button key='cancel' onClick={handleCancel} disabled={loadingAndDisablingButtons}>
          {cancelText ? cancelText : ''}
        </Button>,
      ]}>
      <Space direction='vertical'>
        {title ? (
          <Title level={4} type='secondary'>
            {title}
          </Title>
        ) : (
          ''
        )}
        {description ? description : ''}
      </Space>
    </Modal>
  ) : null;
}
