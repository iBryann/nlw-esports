import { InputHTMLAttributes, memo } from 'react';


export default memo((props: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
    />
));