import { useState } from "react";
import { useSettingStore } from "@/store/setting";

type Model = {
  name: string;
  description: string;
  displayName: string;
  inputTokenLimit: number;
  maxTemperature?: number;
  outputTokenLimit: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  supportedGenerationMethods: string[];
  version: string;
};

function useModel() {
  const [modelList, setModelList] = useState<string[]>([]);

  async function refresh(): Promise<string[]> {
    const { apiKey, apiProxy, accessPassword } = useSettingStore.getState();

    if (apiKey || accessPassword) {
      const response = await fetch(
        apiKey
          ? `${
              apiProxy || "https://generativelanguage.googleapis.com"
            }/v1beta/models`
          : "/api/ai/google/v1beta/models",
        { headers: { "x-goog-api-key": apiKey ? apiKey : accessPassword } }
      );
      const { models = [] } = await response.json();
      const newModelList = (models as Model[])
        .filter((item) =>
          item.supportedGenerationMethods.includes("generateContent")
        )
        .map((item) => item.name.replace("models/", ""));
      setModelList(newModelList);
      return newModelList;
    } else {
      return [];
    }
  }

  return {
    modelList,
    refresh,
  };
}

export default useModel;
