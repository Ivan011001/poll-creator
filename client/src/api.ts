const baseApiUrl = `http://localhost:3001`;

interface ApiError {
  messages: string[];
  statusCode?: number;
}

interface MakeRequestResponse<T> {
  data: T | Record<string, never>;
  error?: ApiError;
}

export const makeRequest = async <T>(
  endpoint: string,
  reqInit?: RequestInit
): Promise<MakeRequestResponse<T>> => {
  try {
    const response = await fetch(`${baseApiUrl}${endpoint}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      ...reqInit,
    });

    const responseJSON = await response.json();

    if (!response.ok) {
      return { data: {}, error: responseJSON as ApiError };
    }

    return { data: responseJSON as T };
  } catch (e) {
    const error =
      e instanceof Error
        ? {
            messages: [
              process.env.MODE === "development" ? e.message : "Unknown error",
            ],
          }
        : {
            messages: ["Unknown error"],
          };

    return {
      data: {},
      error,
    };
  }
};
