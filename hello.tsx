import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";

import type { ZodType } from "zod";

interface IAIModel {
  modelName: string;
  provider: string;
  temperature: number;
  apiKey: string;
  retryCount?: number;
  organization: string | undefined;
}

export class AIModel {
  private model: ChatOpenAI;

  constructor(options: IAIModel) {
    switch (options.provider) {
      case "openai":
        this.model = new ChatOpenAI({
          apiKey: options.apiKey,
          ...(options.organization && { organization: options.organization }),
          temperature: options.temperature,
          modelName: options.modelName,
        });
        break;
      case "azureai":
        this.model = new AzureChatOpenAI({
          temperature: options.temperature,
        });
        break;
      case "bedrock":
        throw new Error("random provider not implemented");
      default:
        throw new Error("Provider not supported");
    }
  }

  public async callModel(prompt: string): Promise<string> {
    const message = await this.model.invoke(prompt);
    return message.content[0] as string;
  }

  public async callStructuredModel(
    prompt: string,
    schema: ZodType
  ): Promise<[]> {
    const modelWithStructuredOutput = this.model.withStructuredOutput(schema, {
      method: "jsonSchema",
      strict: true,
      includeRaw: true,
    });
    const res = await modelWithStructuredOutput.invoke(prompt);

    if (res.parsed) {
      return res.parsed;
    }

    return parseJson(res.raw.content[0] as string);
  }
}

const parseJson = (json: string) => {
  const jsonString = json
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/```/g, "\\`\\`\\`")
    .replace(/`/g, "\\`")
    .replace(/"/g, '\\"')
    .replace(/\f/g, "\\f")
    .replace(/\b/g, "\\b")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return JSON.parse(jsonString);
};
