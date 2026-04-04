import { type Transport } from "../client/transport";

export function createDicomRouterClient(transport: Transport) {
  return {
    downloadConfig(input?: { signal?: AbortSignal }) {
      return transport.requestText({
        method: "GET",
        path: "/dicom-router",
        headers: {
          accept: "application/yaml, text/yaml, text/plain, */*",
        },
        ...(input?.signal ? { signal: input.signal } : {}),
      });
    },
  };
}
