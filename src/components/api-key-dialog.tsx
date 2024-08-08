import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRecoilState } from "recoil";
import { apiKeysState } from "@/atoms/api-keys";
import { useState } from "react";

export default function ApiKeyDialog() {
  const [apiKeys, setApiKeys] = useRecoilState(apiKeysState);
  const [openai, setOpenai] = useState(apiKeys.openai);
  const [anthropic, setAnthropic] = useState(apiKeys.anthropic);
  const [gemini, setGemini] = useState(apiKeys.gemini);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setApiKeys({
      openai,
      anthropic,
      gemini,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Add Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter API Key</DialogTitle>
          <DialogDescription>
            Your API Key is stored locally on your browser and never sent
            anywhere else.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openai" className="text-right">
                OpenAI
              </Label>
              <Input
                id="openai"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="col-span-3"
                value={openai}
                onChange={(e) => setOpenai(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anthropic" className="text-right">
                Anthropic
              </Label>
              <Input
                id="anthropic"
                placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="col-span-3"
                value={anthropic}
                onChange={(e) => setAnthropic(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gemini" className="text-right">
                Gemini
              </Label>
              <Input
                id="gemini"
                placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="col-span-3"
                value={gemini}
                onChange={(e) => setGemini(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
