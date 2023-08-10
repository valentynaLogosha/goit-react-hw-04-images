import { useState, useEffect } from 'react';
import * as API from '../../services/PixabayApi';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from '../Button/Button';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader';

const App = () => {
  // встановлення початкового стану 
  const [searchName, setSearchName] = useState(''); // зберігає запит для пошуку
  const [images, setImages] = useState([]); //зберігає завантаженні картинки
  const [currentPage, setCurrentPage] = useState(1); //Зберігає поточний номер сторінки
  const [isLoading, setIsLoading] = useState(false); //індикатор загрузки зображення
  const [totalPages, setTotalPages] = useState(0); // зберігає загальну кількість сторінок 

  useEffect(() => {
    if (searchName === '') {
      return;
    }

    async function addImages() {
      try {
        // встановлюємо флаг завантаження
        setIsLoading(true);
        // отримуємо дані за допомогою API запиту до Pixabay
        const data = await API.getImages(searchName, currentPage);

        if (data.hits.length === 0) {
          // якщо картинка не знайдена, виводимо повідомлення
          return toast.info('Sorry image not found...', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        // Нормалізуємо отримані картинки
        const normalizedImages = API.normalizedImages(data.hits);

        setImages(prevImages => [...prevImages, ...normalizedImages]); // Добавляємо нові картинки до існуючих
        setIsLoading(false); // скидаємо флаг завантаження
        setTotalPages(Math.ceil(data.totalHits / 12)); // вираховуємо загальну кількість сторінок
      } catch {
        toast.error('Something went wrong!', {
          position: toast.POSITION.TOP_RIGHT,
        }); // Якщо сталася помилка, виводимо повідомлення
      } finally {
        setIsLoading(false); // У будь-якому випадку скидаємо прапор завантаження
      }
    }
    addImages();
  }, [searchName, currentPage]);

  // Метод для завантаження додаткових зображень шляхом збільшення номера поточної сторінки
  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  // Метод для обробки відправки форми пошуку
  const handleSubmit = query => {
    setSearchName(query); // Встановлюємо введений запит в стан
    setImages([]); // Очищаємо масив із зображеннями
    setCurrentPage(1); // Скидаємо номер поточної сторінки на першу
  };

  return (
    <div>
      <ToastContainer transition={Slide} />
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 ? (
        <ImageGallery images={images} />
      ) : (
        <p
          style={{
            padding: 100,
            textAlign: 'center',
            fontSize: 30,
          }}
        >
          Image gallery is empty... 📷
        </p>
      )}
      {isLoading && <Loader />}
      {images.length > 0 && totalPages !== currentPage && !isLoading && (
        <Button onClick={loadMore} /> // Кнопка для завантаження додаткових зображень
      )}
    </div>
  );
};

export default App;