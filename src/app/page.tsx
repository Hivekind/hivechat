import { Metadata } from "next";
import Playground from "./playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

export default function PlaygroundPage() {
  return <Playground />;
}
