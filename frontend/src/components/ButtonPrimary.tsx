import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonPrimary({ className = '', ...props }: Props) {
  return (
    <button
      className={`rounded-xl px-4 py-2 font-medium shadow ${className} bg-blue-600 text-white hover:bg-blue-700 active:translate-y-px`}
      {...props}
    />
  )
}
