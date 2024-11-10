export const getSandboxContent = async (url: string) => {
  const result = await fetch(url);
  const { status, statusText } = result;
  if (status === 200) {
    const content = await result.text();
    return content;
  } else {
    console.log('get sandbox code error', statusText);
    return '';
  }
};
