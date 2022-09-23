import { Trigger } from "@radix-ui/react-dialog";
import { MagnifyingGlassPlus } from "phosphor-react";
import { memo } from 'react';


export const CreateAdBanner = memo(() => ( 
        <div className='pt-1 mt-8 bg-nlw-gradient self-stretch rounded-lg overflow-hidden'>
            <div className='bg-[#2A2634] px-8 py-6 flex justify-between items-center flex-col sm:flex-row'>
                <div>
                    <strong className='text-2xl text-white font-black block'>Não encontrou seu duo?</strong>
                    <span className='text-zinc-400 block'>Publique um anúncio para encontrar novos players!</span>
                </div>

                <Trigger className='flex gap-4 justify-center items-center py-3 px-4 bg-violet-500 text-white rounded hover:bg-violet-600 w-full sm:w-auto mt-5 sm:mt-0 transition'>
                    <MagnifyingGlassPlus size={24} />
                    Publicar anúncio
                </Trigger>
            </div>
        </div>
    )
);