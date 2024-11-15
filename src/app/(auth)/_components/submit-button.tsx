"use client";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText,
  className = "",
  ...props
}: Props) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      className={`w-full rounded mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isPending ? pendingText : children}
    </button>
  );
}
