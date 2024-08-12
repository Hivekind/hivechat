import { Button } from "@/components/ui/button";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

export enum ButtonStates {
  default,
  busy,
  success,
  disabled,
}

export default function StatefulButton({
  state,
  children,
  ...rest
}: {
  state?: ButtonStates;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...rest}
      disabled={state === ButtonStates.busy || state === ButtonStates.disabled}
    >
      {state === ButtonStates.busy && (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      )}
      {state === ButtonStates.success && (
        <CheckCircledIcon className="mr-2 h-4 w-4" />
      )}
      {children}
    </Button>
  );
}
