import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from 'phosphor-react';

import Input from './Form/Input';
import Select from './Form/Select';
import { API } from '../API';


export interface Game {
    id: string,
    title: string,
}

export function CreateAdModal({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [games, setGames] = useState<Game[]>([]);
    const [check, setCheck] = useState(false);
    const [gameSelected, setGameSelected] = useState('');
    const [weekDays, setWeekDays] = useState<string[]>([]);

    useEffect(() => {
        API.get('/games')
            .then(response => setGames(response.data));
    }, []);

    function handleCreateAd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data: Record<string, any> = Object.fromEntries(formData);

        API.post(`/games/${gameSelected}/ads`, {
            name: data.name,
            yearsPlaying: Number(data.yearsPlaying),
            discord: data.discord,
            weekDays: weekDays.map(Number).sort(),
            hoursStart: data.hoursStart,
            hoursEnd: data.hoursEnd,
            useVoiceChannel: check
        })
            .then(res => {
                setOpen(false);
                alert('Anúncio criado com sucesso!');
            })
            .catch(err => {
                console.error(err);
                alert('Erro ao criar o anúncio!');
            })
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black/60' />

            <Dialog.Content className='z-[2] fixed w-[500px] bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg shadow-black/25'>
                <Dialog.Title className='text-3xl font-black'>
                    Publique um anúncio
                </Dialog.Title>

                <form onSubmit={handleCreateAd} className='flex flex-col gap-4 mt-8'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='game' className='font-semibold'>Qual o game?</label>

                        <Select
                            list={games}
                            label='Selecione o game que deseja jogar'
                            setSelected={setGameSelected}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='name'>Seu nome (ou nickname)</label>
                        <Input name='name' id='name' placeholder='Como te chamam dentro do game?' />
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='yearsPlaying'>Joga há quantos anos?</label>
                            <Input name='yearsPlaying' type='number' id='yearsPlaying' placeholder='Tudo bem ser ZERO' />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor='discord'>Qual seu Discord?</label>
                            <Input name='discord' id='discord' placeholder='Usuario#0000' />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='weekDays'>Quando costuma jogar?</label>

                            <ToggleGroup.Root
                                type='multiple'
                                className='grid grid-cols-4 gap-2'
                                value={weekDays}
                                onValueChange={setWeekDays}
                            >
                                <ToggleGroupItem value='0' title='Domingo' days={weekDays} />
                                <ToggleGroupItem value='1' title='Segunda' days={weekDays} />
                                <ToggleGroupItem value='2' title='Terça' days={weekDays} />
                                <ToggleGroupItem value='3' title='Quarta' days={weekDays} />
                                <ToggleGroupItem value='4' title='Quinta' days={weekDays} />
                                <ToggleGroupItem value='5' title='Sexta' days={weekDays} />
                                <ToggleGroupItem value='6' title='Sábado' days={weekDays} />
                            </ToggleGroup.Root>
                        </div>

                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor='HourStart'>Qual horário do dia?</label>

                            <div className='grid grid-cols-2 gap-2'>
                                <Input name='hoursStart' id='hoursStart' type='time' placeholder='De' />
                                <Input name='hoursEnd' id='hoursEnd' type='time' placeholder='Até' />
                            </div>
                        </div>
                    </div>

                    <label className='flex items-center gap-2 mt-2 text-sm'>
                        <Checkbox.Root
                            className='w-6 h-6 p-1 rounded bg-zinc-900'
                            onCheckedChange={checked => setCheck(checked === true ? true : false)}
                        >
                            <Checkbox.Indicator>
                                <Check className='text-emerald-400' size={16} />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        Costumo me conectar ao chat de voz
                    </label>

                    <footer className='mt-4 flex justify-end gap-4'>
                        <Dialog.Close
                            type='button'
                            className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 transition'
                        >
                            Cancelar
                        </Dialog.Close>

                        <button
                            type='submit'
                            className='flex gap-3 items-center bg-violet-500 px-5 h-12 rounded-md font-semibold hover:bg-violet-600 transition'
                        >
                            <GameController size={24} />
                            Encontrar duo
                        </button>
                    </footer>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    );
}

const ToggleGroupItem = ({ days, title, value }: { value: string, title: string, days: string[] }) => {
    return (
        <ToggleGroup.Item
            value={value}
            title={title}
            className={`w-8 h-8 rounded ${days.includes(value) ? 'bg-violet-500' : 'bg-zinc-900'} `}
        >
            {title[0]}
        </ToggleGroup.Item>
    );
}