import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import './styles/main.css';
import logoImg from './assets/logo-nlw-esports.png';
import GameSlider from './components/GameSlider';
import { CreateAdModal } from './components/CreateAdModal';
import { CreateAdBanner } from './components/CreateAdBanner';


export interface Game {
    id: string,
    title: string,
    bannerUrl: string,
    _count: {
        ads: number
    }
}

function App() {
    const [open, setOpen] = useState(false);

    return (
        <div className='max-w-[1344px] mx-auto flex flex-col items-center  my-12 sm:my-20 px-4'>
            <img src={logoImg} alt="Logo NLW eSports" />

            <h1 className='text-5xl sm:text-6xl text-white font-black mt-12 sm:mt-20'>
                Seu <span className='text-transparent bg-nlw-gradient bg-clip-text'>duo</span> esta aqui.
            </h1>

            <GameSlider />

            <Dialog.Root open={open} onOpenChange={setOpen}>
                <CreateAdBanner />

                <CreateAdModal setOpen={setOpen} />
            </Dialog.Root>
        </div>
    );
}


export default App;
