import { useState } from "react";
import { streamText, smoothStream } from "ai";
import { toast } from "sonner";
import { useGoogleProvider } from "@/hooks/useAiProvider";
import { useSettingStore } from "@/store/setting";
import {
  AIWritePrompt,
  changeLanguagePrompt,
  changeReadingLevelPrompt,
  adjustLengthPrompt,
  continuationPrompt,
  addEmojisPrompt,
} from "@/utils/artifact";
import { parseError } from "@/utils/error";

type ArtifactProps = {
  value: string;
  onChange: (value: string) => void;
};

function handleError(error: unknown) {
  const errorMessage = parseError(error);
  toast.error(errorMessage);
}

function useArtifact({ value, onChange }: ArtifactProps) {
  const google = useGoogleProvider();
  const [loadingAction, setLoadingAction] = useState<string>("");

  async function AIWrite(prompt: string, systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("aiWrite");
    const result = streamText({
      model: google(thinkingModel),
      prompt: AIWritePrompt(value, prompt, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  async function translate(lang: string, systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("translate");
    const result = streamText({
      model: google(thinkingModel),
      prompt: changeLanguagePrompt(value, lang, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  async function changeReadingLevel(level: string, systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("readingLevel");
    const result = streamText({
      model: google(thinkingModel),
      prompt: changeReadingLevelPrompt(value, level, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  async function adjustLength(length: string, systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("adjustLength");
    const result = streamText({
      model: google(thinkingModel),
      prompt: adjustLengthPrompt(value, length, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  async function continuation(systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("continuation");
    const result = streamText({
      model: google(thinkingModel),
      prompt: continuationPrompt(value, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  async function addEmojis(systemInstruction?: string) {
    const { thinkingModel } = useSettingStore.getState();
    setLoadingAction("addEmojis");
    const result = streamText({
      model: google(thinkingModel),
      prompt: addEmojisPrompt(value, systemInstruction),
      experimental_transform: smoothStream(),
      onError: handleError,
    });
    let text = "";
    for await (const textPart of result.textStream) {
      text += textPart;
      onChange(text);
    }
    text = "";
    setLoadingAction("");
  }

  return {
    loadingAction,
    AIWrite,
    translate,
    changeReadingLevel,
    adjustLength,
    continuation,
    addEmojis,
  };
}

export default useArtifact;
