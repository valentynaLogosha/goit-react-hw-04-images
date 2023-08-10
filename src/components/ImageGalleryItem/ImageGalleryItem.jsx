import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import { Item, Img } from './ImageGalleryItem.styled';

const ImageItem = ({ image }) => {
  const [showModal, setShowModal] = useState(false); // Зберігає стан модального вікна (відчинено чи закрито)

 // Метод перемикання стану модального вікна
  const toggleModal = () => {
    setShowModal(prevModal => !prevModal); // Інвертує значення showModal
  };

  return (
    <>
      <Item>
        <Img
          src={image.webformatURL} // URL маленького зображення
          alt={image.tags} // Теги зображення
          onClick={toggleModal} // Обробник кліка для відкриття модального вікна
        />
        {showModal && ( //якщо showModal дорівнює true, відображаємо модальне вікно
          <Modal
            largeImageURL={image.largeImageURL} // URL великого зображення
            tags={image.tags} // Теги зображення
            onClose={toggleModal} //Обробник для закриття модального вікна
          />
        )}
      </Item>
    </>
  );
};

ImageItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImageItem;