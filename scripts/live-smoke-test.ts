import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";

import {
  createSatuSehatClientFromEnv,
  type FetchLike,
  type PatientSearchParams,
  type SatuSehatEnvSource,
} from "../src";
import { SatuSehatApiError, SatuSehatConfigError } from "../src/core/errors";

const env = process.env as SatuSehatEnvSource;
const tokenCacheFile = env.SATUSEHAT_TOKEN_CACHE_FILE;

let authCallCount = 0;
let resourceCallCount = 0;

const trackedFetch: FetchLike = async (input, init) => {
  const url = String(input);

  if (url.includes("/accesstoken")) {
    authCallCount += 1;
  } else {
    resourceCallCount += 1;
  }

  return fetch(input, init);
};

async function main(): Promise<void> {
  const searchInput = resolveSearchInput(env);

  console.log("Running SATUSEHAT live smoke test...");
  console.log(`Search mode: ${"identifier" in searchInput ? "identifier" : "name"}`);
  console.log(`Token cache file: ${tokenCacheFile ?? "(disabled)"}`);
  console.log(`Cache exists before run: ${tokenCacheFile ? existsSync(tokenCacheFile) : false}`);

  const client = createSatuSehatClientFromEnv(env, {
    fetch: trackedFetch,
  });

  const firstResult = await client.patient.search(searchInput);
  const secondResult = await client.patient.search(searchInput);

  console.log(`First call bundle total: ${firstResult.total ?? 0}`);
  console.log(`Second call bundle total: ${secondResult.total ?? 0}`);
  console.log(`Auth calls observed: ${authCallCount}`);
  console.log(`Resource calls observed: ${resourceCallCount}`);

  if (tokenCacheFile && existsSync(tokenCacheFile)) {
    const info = await stat(tokenCacheFile);
    console.log(`Cache exists after run: true (${info.size} bytes)`);
  } else {
    console.log("Cache exists after run: false");
  }

  if (authCallCount <= 1) {
    console.log("Token cache reuse looks healthy.");
  } else {
    console.log("Token cache reuse may need investigation.");
  }
}

function resolveSearchInput(source: SatuSehatEnvSource): PatientSearchParams {
  if (source.SATUSEHAT_TEST_PATIENT_IDENTIFIER) {
    return {
      identifier: source.SATUSEHAT_TEST_PATIENT_IDENTIFIER,
    };
  }

  if (
    source.SATUSEHAT_TEST_PATIENT_NAME &&
    source.SATUSEHAT_TEST_PATIENT_BIRTHDATE &&
    source.SATUSEHAT_TEST_PATIENT_NIK
  ) {
    return {
      name: source.SATUSEHAT_TEST_PATIENT_NAME,
      birthdate: source.SATUSEHAT_TEST_PATIENT_BIRTHDATE,
      nik: source.SATUSEHAT_TEST_PATIENT_NIK,
    };
  }

  if (
    source.SATUSEHAT_TEST_PATIENT_NAME &&
    source.SATUSEHAT_TEST_PATIENT_BIRTHDATE &&
    source.SATUSEHAT_TEST_PATIENT_GENDER
  ) {
    return {
      name: source.SATUSEHAT_TEST_PATIENT_NAME,
      birthdate: source.SATUSEHAT_TEST_PATIENT_BIRTHDATE,
      gender: source.SATUSEHAT_TEST_PATIENT_GENDER as "male" | "female",
    };
  }

  if ((source.SATUSEHAT_ENV ?? "sandbox") === "sandbox") {
    return {
      identifier: "https://fhir.kemkes.go.id/id/nik|9271060312000001",
    };
  }

  throw new SatuSehatConfigError(
    "Set SATUSEHAT_TEST_PATIENT_IDENTIFIER or provide SATUSEHAT_TEST_PATIENT_NAME with SATUSEHAT_TEST_PATIENT_BIRTHDATE plus SATUSEHAT_TEST_PATIENT_NIK/gender.",
  );
}

main().catch((error: unknown) => {
  if (error instanceof SatuSehatApiError) {
    console.error(`SATUSEHAT API error: status=${error.status}`);
    console.error(JSON.stringify(error.response, null, 2));
    process.exitCode = 1;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
