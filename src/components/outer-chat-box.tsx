import { ModelSelector } from "./model-selector";

type Props = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  children: React.ReactNode;
};

const OuterChatBox = ({ selectedModel, setSelectedModel, children } : Props) => {
  return (
    <main
      style={{
        flex: 1,
        overflowY: "scroll",
        padding: "10px",
        maxHeight: "80vh",
      }}
      className="border border-slate-200 rounded-lg p-4 h-[80vh]"
    >
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      {children}
    </main>
  );
};

export { OuterChatBox };
