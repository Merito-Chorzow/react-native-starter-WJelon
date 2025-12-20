const BASE_URL = "https://jsonplaceholder.typicode.com";

export type RemoteNoteDTO = {
  id: number;
  title: string;
  body: string;
};

export async function fetchRemoteNotes(signal?: AbortSignal): Promise<RemoteNoteDTO[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=10`, { signal });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function createRemoteNote(payload: { title: string; body: string }, signal?: AbortSignal) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<{ id: number; title: string; body: string }>;
}
