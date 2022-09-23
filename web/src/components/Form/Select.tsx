import * as Select from '@radix-ui/react-select';
import { Game } from '../CreateAdModal';
import { Dispatch, memo, SetStateAction } from 'react';
import { Check, CaretDown, CaretUp } from 'phosphor-react';


interface Props {
    label: string,
    list: Game[],
    setSelected: Dispatch<SetStateAction<string>>
}

export default memo(({ label, list, setSelected }: Props) => (
    <Select.Root onValueChange={value => setSelected(value)}>
        <Select.Trigger
            className='flex items-center justify-between rounded py-3 px-4 text-sm bg-zinc-900'
        >
            <Select.Value placeholder={label} />

            <Select.SelectIcon>
                <CaretDown />
            </Select.SelectIcon>
        </Select.Trigger>

        <Select.Portal>
            <Select.Content className='z-[3] overflow-hidden bg-white rounded-md shadow-lg'>
                <Select.ScrollUpButton className='flex items-center justify-center h-6 bg-white text-zinc-900 cursor-default'>
                    <CaretUp />
                </Select.ScrollUpButton>

                <Select.Viewport className='p-2'>
                    {list.map(game =>
                        <Select.Item
                            key={game.id}
                            value={game.id}
                            className='relative flex items-center h-6 pt-0 pr-9 pb-0 pl-6 text-sm text-zinc-900 rounded-sm cursor-pointer hover:text-white hover:bg-violet-500'
                        >
                            <Select.ItemText>{game.title}</Select.ItemText>

                            <Select.ItemIndicator className='absolute left-0 w-6 flex items-center justify-center'>
                                <Check />
                            </Select.ItemIndicator>
                        </Select.Item>
                    )}
                </Select.Viewport>

                <Select.ScrollDownButton className='flex items-center justify-center h-6 bg-white text-zinc-900 cursor-default'>
                    <CaretDown />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
));