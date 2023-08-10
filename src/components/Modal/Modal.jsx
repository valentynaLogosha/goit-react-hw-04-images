import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalWindow } from './Modal.styled';

// / Об'єкт модального вікна в DOM-дереві
const modalRoot = document.querySelector('#modal-root');

//Класовий компонент Modal
const Modal = ({ largeImageURL, tags, onClose }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose(); // Закриваємо модальне вікно при натисканні клавіші Escape
      }
    };

    window.addEventListener('keydown', handleKeyDown); // Додаємо обробник події натискання клавіші
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Видаляємо обробник події натискання клавіші
      document.body.style.overflow = 'visible';
    };
  }, [onClose]);

  // Обробник кліка на фоні модального вікна
  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose(); // Закриваємо модальне вікно при кліку на фон
    }
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow>
        <img src={largeImageURL} alt={tags} />
      </ModalWindow>
    </Overlay>,
    modalRoot // Рендерим модальне вікно в об'єкті modalRoot в DOM-дереві
  );
};

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;