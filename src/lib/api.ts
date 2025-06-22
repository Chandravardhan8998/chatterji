const url = 'http://127.0.0.1:8000';

export type StepsTypes =
  | 'extract_topic'
  //   | 'enhance_prompt'
  | 'extract_sub_topic'
  | 'split_text_doc'
  | 'embedd_topic'
  | 'run_user_query'
  | 'END';
//   | 'persona_inject'
// graph_builder.add_edge("extract_topic","extract_sub_topic")
// graph_builder.add_edge("extract_sub_topic","split_text_doc")
// graph_builder.add_edge("split_text_doc","embedd_topic")
// graph_builder.add_edge("embedd_topic","run_user_query")

export interface StreamResponse {
  current_step: StepsTypes;
  ui_response_text: string;
  next_step: StepsTypes;
}

export async function runQuery(
  prompt: string,
  onChunk: (data: StreamResponse) => void,
) {
  try {
    const response = await fetch(`${url}/run-query?prompt=${prompt}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream', // for OpenAI-style streams
      },
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      const chunk = decoder.decode(value, { stream: true });

      // Optional: Split for SSE or OpenAI-like format
      chunk.split('\n').forEach(line => {
        if (line.startsWith('data:')) {
          const data = line.replace('data: ', '').trim();
          if (data !== '[DONE]') {
            const json: StreamResponse = JSON.parse(data);
            onChunk?.(json); // callback with each streamed part
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
