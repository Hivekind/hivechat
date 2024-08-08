import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApiKeyDialog() {
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="openai" className="text-right">
              OpenAI
            </Label>
            <Input
              id="openai"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="col-span-3"
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
