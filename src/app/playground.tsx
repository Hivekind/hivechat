"use client";

import Image from "next/image";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { CodeViewer } from "@/components/code-viewer";
import { MaxLengthSelector } from "@/components/maxlength-selector";
import { ModelSelector } from "@/components/model-selector";
import { PresetActions } from "@/components/preset-actions";
import { PresetSave } from "@/components/preset-save";
import { PresetSelector } from "@/components/preset-selector";
import { PresetShare } from "@/components/preset-share";
import { TemperatureSelector } from "@/components/temperature-selector";
import { TopPSelector } from "@/components/top-p-selector";
import { models, types } from "@/data/models";
import { presets } from "@/data/presets";
import { RecoilRoot } from "recoil";
import MessageForm from "@/components/message-form";
import ChatBox from "@/components/chat-box";

export default function Playground() {
  return (
    <RecoilRoot>
      <div className="md:hidden">
        <Image
          src="https://ui.shadcn.com/examples/playground-light.png"
          width={1280}
          height={916}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="https://ui.shadcn.com/examples/playground-dark.png"
          width={1280}
          height={916}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-5">
          <div className="pb-12 hidden lg:block">
            <div className="space-y-4 py-4">
              <Discover />
              <Library />
              <Playlists />
            </div>
          </div>
          <Tabs defaultValue="complete" className="flex-1 col-span-4">
            <div className="container h-full py-6">
              <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
                <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                  <div className="grid gap-2">
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Mode
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-[320px] text-sm"
                        side="left"
                      >
                        Choose the interface that best suits your task. You can
                        provide: a simple prompt to complete, starting and
                        ending text to insert a completion within, or some text
                        with instructions to edit it.
                      </HoverCardContent>
                    </HoverCard>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="complete">
                        <span className="sr-only">Complete</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <rect
                            x="4"
                            y="3"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="7"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="13"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                        </svg>
                      </TabsTrigger>
                      <TabsTrigger value="insert">
                        <span className="sr-only">Insert</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
                            fill="currentColor"
                          ></path>
                          <rect
                            x="4"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="13"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                        </svg>
                      </TabsTrigger>
                      <TabsTrigger value="edit">
                        <span className="sr-only">Edit</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <rect
                            x="4"
                            y="3"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="7"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="15"
                            width="4"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <path
                            d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <ModelSelector types={types} models={models} />
                  <TemperatureSelector defaultValue={[0.56]} />
                  <MaxLengthSelector defaultValue={[256]} />
                  <TopPSelector defaultValue={[0.9]} />
                </div>
                <div className="md:order-1">
                  <TabsContent value="complete" className="mt-0 border-0 p-0">
                    <div className="flex h-full flex-col space-y-4">
                      <ChatBox />
                      <MessageForm />
                    </div>
                  </TabsContent>
                  <TabsContent value="insert" className="mt-0 border-0 p-0">
                    <div className="flex flex-col space-y-4">
                      <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                        <Textarea
                          placeholder="We're writing to [inset]. Congrats from OpenAI!"
                          className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                        />
                        <div className="rounded-md border bg-muted"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button>Submit</Button>
                        <Button variant="secondary">
                          <span className="sr-only">Show history</span>
                          <CounterClockwiseClockIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="edit" className="mt-0 border-0 p-0">
                    <div className="flex flex-col space-y-4">
                      <div className="grid h-full gap-6 lg:grid-cols-2">
                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-1 flex-col space-y-2">
                            <Label htmlFor="input">Input</Label>
                            <Textarea
                              id="input"
                              placeholder="We is going to the market."
                              className="flex-1 lg:min-h-[580px]"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                              id="instructions"
                              placeholder="Fix the grammar."
                            />
                          </div>
                        </div>
                        <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button>Submit</Button>
                        <Button variant="secondary">
                          <span className="sr-only">Show history</span>
                          <CounterClockwiseClockIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </RecoilRoot>
  );
}
function Discover() {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        Discover
      </h2>
      <div className="space-y-1">
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
          Listen Now
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <rect width="7" height="7" x="3" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="14" rx="1"></rect>
            <rect width="7" height="7" x="3" y="14" rx="1"></rect>
          </svg>
          Browse
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
          </svg>
          Radio
        </button>
      </div>
    </div>
  );
}

function Playlists() {
  return (
    <div className="py-2">
      <h2 className="relative px-7 text-lg font-semibold tracking-tight">
        Playlists
      </h2>
      <div
        dir="ltr"
        className="relative overflow-hidden h-[300px] px-1"
        style={{
          position: "relative",
          "--radix-scroll-area-corner-width": "0px",
          "--radix-scroll-area-corner-height": "0px",
        }}
      >
        <div
          data-radix-scroll-area-viewport=""
          className="h-full w-full rounded-[inherit]"
          style={{ overflow: "hidden scroll" }}
        >
          <div style={{ minWidth: "100%", display: "table" }}>
            <div className="space-y-1 p-2">
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Recently Added
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Recently Played
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Top Songs
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Top Albums
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Top Artists
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Logic Discography
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Bedtime Beats
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Feeling Happy
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                I miss Y2K Pop
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Runtober
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Mellow Days
              </button>
              <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6"></path>
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M12 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M12 18H3"></path>
                </svg>
                Eminem Essentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Library() {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        Library
      </h2>

      <div className="space-y-1">
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M21 15V6"></path>
            <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
            <path d="M12 12H3"></path>
            <path d="M16 6H3"></path>
            <path d="M12 18H3"></path>
          </svg>
          Playlists
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <circle cx="8" cy="18" r="4"></circle>
            <path d="M12 18V2l7 4"></path>
          </svg>
          Songs
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Made for You
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
            <circle cx="17" cy="7" r="5"></circle>
          </svg>
          Artists
        </button>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m16 6 4 14"></path>
            <path d="M12 6v14"></path>
            <path d="M8 8v12"></path>
            <path d="M4 4v16"></path>
          </svg>
          Albums
        </button>
      </div>
    </div>
  );
}
