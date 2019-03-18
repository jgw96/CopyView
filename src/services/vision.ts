const key = "724fb3dd550545ffad5ce2dad9133016";

export async function identify(blob: Blob) {
  try {
    const response = await fetch("https://westus.api.cognitive.microsoft.com/vision/v1.0/recognizeText?mode=handwriting", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': key
      },
      body: blob
    });

    const loc = response.headers.get('Operation-Location');
    return loc;
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

export async function getText(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Ocp-Apim-Subscription-Key': key
    }
  });

  const data = await response.json();
  console.log(data);

  if (data.status === 'Succeeded') {
    console.log("stopped");
    return data;
  }
}