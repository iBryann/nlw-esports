import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from 'phosphor-react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Input from './Form/Input';
import Select from './Form/Select';
import { API } from '../API';


interface IForm {
    name: string,
    yearsPlaying: number,
    discord: string,
    weekDays: number[],
    hoursStart: string,
    hoursEnd: string,
    useVoiceChannel: boolean,
    gameId: string,
}
export interface Game {
    id: string,
    title: string,
}

export function CreateAdModal({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [error, setError] = useState({} as Record<string, string>);
    const [games, setGames] = useState<Game[]>([]);
    const [check, setCheck] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [gameSelected, setGameSelected] = useState('');
    const [weekDays, setWeekDays] = useState<string[]>([]);

    const schema = Yup.object().shape({
        name: Yup.string().required(),
        discord: Yup.string().required(),
        yearsPlaying: Yup.number().required(),
        hoursStart: Yup.string().required().test('valid-time', 'Informe uma hora válida.', (value) => !!('' + value).match(/[0-5][0-9]:[0-5][0-9]/)),
        hoursEnd: Yup.string().required()
            .test('valid-time', 'Informe uma hora válida.', (value) => !!('' + value).match(/[0-5][0-9]:[0-5][0-9]/))
            // .test('greater-time', 'A data final precisa ser maior.', (value, context) => {
            //     const dateIniSplited: string[] = context.parent.hoursStart!.split(':');
            //     const dateEndSplited = value!.split(':');
            //     const dateIni = new Date(0, 0, 0, +dateIniSplited[0], +dateIniSplited[1]);
            //     const dateEnd = new Date(0, 0, 0, +dateEndSplited[0], +dateEndSplited[1]);

            //     return dateIni < dateEnd;
            // }),
    });

    useEffect(() => {
        submitted && isInvalidFields();
    }, [submitted, gameSelected, weekDays]);

    useEffect(() => {
        API.get('/games')
            .then(response => setGames(response.data));
    }, []);

    function isInvalidFields() {
        let haveError = false;

        setError({});
        if (!gameSelected) {
            setError(s => ({ ...s, gameSelected: 'Selecione um game' }));
            haveError = true;
        }
        if (!weekDays.length) {
            setError(s => ({ ...s, weekDays: 'Selecione os dias' }));
            haveError = true;
        }

        return haveError;
    }

    function handleCreateAd(formData: Record<string, any>) {
        setSubmitted(true);
        if (isInvalidFields()) return;

        const form = formData as IForm;
        form.useVoiceChannel = check;
        form.weekDays = weekDays.map(Number).sort();

        API.post(`/games/${gameSelected}/ads`, form)
            .then(res => {
                setOpen(false);
                alert('Anúncio criado com sucesso!');
            })
            .catch(err => {
                console.error(err);
                alert('Erro ao criar o anúncio!');
            });
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black/60' />

            <Dialog.Content className='z-[2] fixed w-[500px] bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg shadow-black/25'>
                <Dialog.Title className='text-3xl font-black'>
                    Publique um anúncio
                </Dialog.Title>

                <Formik
                    initialValues={{
                        name: '',
                        discord: '',
                        yearsPlaying: '',
                        hoursStart: '',
                        hoursEnd: '',
                    }}
                    validationSchema={schema}
                    onSubmit={form => handleCreateAd(form)}
                >
                    <Form className='flex flex-col gap-4 mt-8'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='game' className='font-semibold'>Qual o game?</label>

                            <Select
                                list={games}
                                label='Selecione o game que deseja jogar'
                                setSelected={setGameSelected}

                            />

                            {error?.gameSelected &&
                                <div className='flex flex-col gap-2 text-sm text-red-500'>
                                    {error.gameSelected}
                                </div>
                            }
                        </div>

                        <Input name='name' label='Seu nome (ou nickname)' placeholder='Como te chamam dentro do game?' />

                        <div className='grid grid-cols-2 gap-6'>
                            <Input name='yearsPlaying' label='Joga há quantos anos?' type='number' placeholder='Tudo bem ser ZERO' />
                            <Input name='discord' label='Qual seu Discord?' placeholder='Usuario#0000' />
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

                                {error?.weekDays &&
                                    <div className='flex flex-col gap-2 text-sm text-red-500'>
                                        {error.weekDays}
                                    </div>
                                }
                            </div>

                            <div className='flex flex-col gap-2 flex-1'>
                                <label htmlFor='HourStart'>Qual horário do dia?</label>

                                <div className='grid grid-cols-2 gap-2'>
                                    <Field
                                        type='time'
                                        name='hoursStart'
                                        className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
                                    />
                                    <Field
                                        type='time'
                                        name='hoursEnd'
                                        className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
                                    />
                                </div>

                                <div className='flex flex-col gap-2 text-sm text-red-500'>
                                    <ErrorMessage name='hoursStart' />
                                    <ErrorMessage name='hoursEnd' />
                                </div>
                            </div>
                        </div>

                        <label className='flex items-center gap-2 mt-2 text-sm'>
                            <Checkbox.Root
                                className='w-6 h-6 p-1 rounded bg-zinc-900'
                                defaultChecked={check}
                                onCheckedChange={checked => setCheck(checked === true ? true : false)}
                            >
                                <Checkbox.Indicator>
                                    <Check className='text-emerald-400' size={16} />
                                </Checkbox.Indicator>
                            </Checkbox.Root>

                            Costumo me conectar ao chat de voz
                        </label>

                        <div className='flex flex-col gap-2 text-sm text-red-500'>
                            <ErrorMessage name='useVoiceChannel' />
                        </div>

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
                    </Form>
                </Formik>
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