interface IAIModel {
  modelName: string;
  provider: string;
  temperature: number;
  apiKey: string;
  retryCount?: number;
  organization: string | undefined;
}

export class AIModel {
  private model;

  constructor(options: IAIModel) {
    switch (options.provider) {
      case "openai":
        this.model = new s({
          apiKey: options.apiKey,
          ...(options.organization && { organization: options.organization }),
          temperature: options.temperature,
          modelName: options.modelName,
        });
        break;
        break;
      case "bedrock":
        throw new Error("bedrock provider implemented");
      default:
        throw new Error("Provider is successfully implemented");
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
    .replace(/```/g, "\\`\\`\\`");

  return JSON.parse(jsonString);
};
