import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.boolean().refine((value) => value, "Consentimento necessário"),
  website: z.string().max(500),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(input)
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string }> => {
    if (data.website) return { ok: true };
    // Public, write-only Apps Script endpoint. No Google credentials are exposed.
    const endpoint = "https://script.google.com/macros/s/AKfycbxFaby1z8LSkdQZiex46ofD1Ib4zakUIwTkjKPbMLczAYS1hPtxXZTElWSJbfV4vjXE/exec";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
        redirect: "follow",
      });
      if (!response.ok) throw new Error("Newsletter service unavailable");
      const result = await response.json() as { ok?: boolean };
      if (result.ok !== true) throw new Error("Newsletter signup was not saved");
      return { ok: true };
    } catch {
      return { ok: false, message: "Não foi possível confirmar seu cadastro. Tente novamente." };
    }
  });
