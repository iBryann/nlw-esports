import { useEffect, useState } from 'react';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';

import './styles.scss';
import { API } from '../../API';
import { Game } from '../../App';
import { GameBanner } from '../GameBanner';


export default () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        API.get<Game[]>('/games')
            .then(({ data }) => setGames(data));
    }, []);

    return (
        <div className='w-full overflow-hidden mt-16'>
            <Swiper
                className='swiper-games'
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 10 },
                    480: { slidesPerView: 3, spaceBetween: 15 },
                    640: { slidesPerView: 4, spaceBetween: 20 },
                    800: { slidesPerView: 5, spaceBetween: 20 },
                    1000: { slidesPerView: 6, spaceBetween: 20 },
                }}
            >
                {games.map(({ _count, bannerUrl, id, title }) => (
                    <SwiperSlide key={id}>
                        <GameBanner
                            key={id}
                            title={title}
                            adsCount={_count.ads}
                            bannerUrl={bannerUrl}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};