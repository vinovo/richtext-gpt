export async function handleSend(inputContent, userApiKey, setOutputContent) {
    setOutputContent(''); // Clear the output before new streaming
  
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputContent,
          apiKey: userApiKey,
        }),
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setOutputContent((prevContent) => prevContent + chunk);
      }
    } catch (error) {
      console.error('Error sending the request', error);
    }
  }
  