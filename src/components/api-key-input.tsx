import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import StatefulButton, { ButtonStates } from "./stateful-button";

export function ApiKeyInput({
  name,
  placeholder,
  url,
  onSubmit,
  value,
  setValue,
  buttonState,
  setButtonState,
  isValid,
}) {
  return (
    <form onSubmit={onSubmit}>
      <Label htmlFor={name} className="text-right">
        {name}{" "}
        <Link
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-600 hover:text-blue-800 text-xs"
        >
          Get key here
        </Link>
      </Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          id={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => {
            setButtonState(ButtonStates.default);
            setValue(e.target.value);
          }}
        />
        <StatefulButton type="submit" state={buttonState}>
          Save
        </StatefulButton>
      </div>
      <p className={`text-xs pt-2 text-red-500 w-5/6 ${isValid && "hidden"}`}>
        Invalid API key. Please make sure your API key is still working
        properly.
      </p>
    </form>
  );
}
