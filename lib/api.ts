export async function apiGet(url: string) {
  const res = await fetch(url, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "GET request failed");
  }

  return data;
}

export async function apiPost(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    // Stop execution here — this is critical
    throw new Error(data?.message || "POST request failed");
  }

  return data;
}
