import { ErrorMessage, Field } from 'formik';
import { InputHTMLAttributes, memo } from 'react';


interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default memo((props: Props) => (
    <div className='flex flex-col gap-2'>
        <label className='flex flex-col gap-2'>
            {props.label}

            <Field
                {...props}
                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
            />
        </label>

        <div className='text-sm text-red-500'>
            <ErrorMessage name={'' + props.name} />
        </div>
    </div>
));